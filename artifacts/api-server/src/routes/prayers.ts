import { Router } from "express";
import { anthropic } from "@workspace/integrations-anthropic-ai";
import { db } from "@workspace/db";
import { communityPrayersTable, prayerUsageTable, userPremiumStatusTable } from "@workspace/db";
import { eq, and, sql } from "drizzle-orm";
import { createClient } from "@replit/revenuecat-sdk/client";
import { listCustomerActiveEntitlements } from "@replit/revenuecat-sdk";
import type { Request, Response } from "express";

const router = Router();

const FREE_LIMIT = 3;

function getCurrentMonth(): string {
  const now = new Date();
  return `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, "0")}`;
}

interface PremiumCacheEntry {
  isPremium: boolean;
  expiresAt: number;
}

const premiumCache = new Map<string, PremiumCacheEntry>();
const CACHE_TTL_PREMIUM = 5 * 60 * 1000; // 5 min
const CACHE_TTL_FREE    = 2 * 60 * 1000; // 2 min — shorter so upgrades propagate faster

// Upserts premium status to the DB for durable cross-restart fallback. Best-effort.
async function persistPremiumStatus(userId: string, isPremium: boolean): Promise<void> {
  await db
    .insert(userPremiumStatusTable)
    .values({ userId, isPremium })
    .onConflictDoUpdate({
      target: userPremiumStatusTable.userId,
      set: { isPremium, verifiedAt: new Date() },
    });
}

// Last-known premium status from DB. Returns null when no record exists (brand-new user).
async function loadPersistedPremiumStatus(userId: string): Promise<boolean | null> {
  const [row] = await db
    .select({ isPremium: userPremiumStatusTable.isPremium })
    .from(userPremiumStatusTable)
    .where(eq(userPremiumStatusTable.userId, userId));
  return row?.isPremium ?? null;
}

// Returns true (premium), false (free), or null (no DB record + RC unavailable).
// Lookup order: in-memory cache → live RC → DB-persisted fallback.
// Previously-confirmed premium users always return true via their DB record, even after restarts.
async function checkPremiumServerSide(userId: string): Promise<boolean | null> {
  const cached = premiumCache.get(userId);
  if (cached && cached.expiresAt > Date.now()) return cached.isPremium;

  const apiKey = process.env.REVENUECAT_API_KEY;
  const projectId = process.env.REVENUECAT_PROJECT_ID;

  if (!apiKey || !projectId) {
    return loadPersistedPremiumStatus(userId).catch(() => null);
  }

  try {
    const client = createClient({
      baseUrl: "https://api.revenuecat.com/v2",
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    const { data, error } = await listCustomerActiveEntitlements({
      client,
      path: { project_id: projectId, customer_id: userId },
    });
    if (error || !data) {
      return loadPersistedPremiumStatus(userId).catch(() => null);
    }

    const isPremium = (data.items ?? []).length > 0;
    premiumCache.set(userId, { isPremium, expiresAt: Date.now() + (isPremium ? CACHE_TTL_PREMIUM : CACHE_TTL_FREE) });
    persistPremiumStatus(userId, isPremium).catch(() => undefined);
    return isPremium;
  } catch {
    return loadPersistedPremiumStatus(userId).catch(() => null);
  }
}

async function getUsageCount(userId: string, month: string): Promise<number> {
  try {
    const [row] = await db
      .select({ count: prayerUsageTable.count })
      .from(prayerUsageTable)
      .where(and(eq(prayerUsageTable.userId, userId), eq(prayerUsageTable.month, month)));
    return row?.count ?? 0;
  } catch {
    return 0;
  }
}

// Atomically reserves a usage slot inside a transaction with an advisory lock,
// preventing concurrent requests from bypassing the limit. Returns false if full.
async function tryReserveSlot(userId: string, month: string): Promise<{ reserved: boolean; count: number }> {
  return db.transaction(async (tx) => {
    await tx.execute(sql`SELECT pg_advisory_xact_lock(1, hashtext(${userId + ":" + month}))`);
    const [row] = await tx
      .select({ count: prayerUsageTable.count })
      .from(prayerUsageTable)
      .where(and(eq(prayerUsageTable.userId, userId), eq(prayerUsageTable.month, month)));
    const current = row?.count ?? 0;
    if (current >= FREE_LIMIT) return { reserved: false, count: current };
    const next = current + 1;
    await tx
      .insert(prayerUsageTable)
      .values({ userId, month, count: next })
      .onConflictDoUpdate({
        target: [prayerUsageTable.userId, prayerUsageTable.month],
        set: { count: next, updatedAt: new Date() },
      });
    return { reserved: true, count: next };
  });
}

// Returns a reserved slot on generation failure so the slot isn't permanently consumed.
async function releaseSlot(userId: string, month: string): Promise<void> {
  try {
    await db
      .update(prayerUsageTable)
      .set({ count: sql`GREATEST(${prayerUsageTable.count} - 1, 0)`, updatedAt: new Date() })
      .where(and(eq(prayerUsageTable.userId, userId), eq(prayerUsageTable.month, month)));
  } catch {
    // best-effort; if this fails the slot stays consumed
  }
}

// Seed prayers are inserted only when the community_prayers table is empty.
// To update these in a running environment, clear the table first: DELETE FROM community_prayers;
const SEED_PRAYERS = [
  {
    title: "Lord, have mercy",
    tradition: "Catholic",
    intention: "Healing",
    text: "Lord Jesus Christ, Lamb of God,\nyou take away the sins of the world — have mercy on us.\nYou who sat with the sick and raised the fallen,\nlook upon this body with your healing gaze.\nHoly Mary, Mother of God, pray for us now.\nMay your grace, poured out through every sacrament,\nreach what no medicine can name.\nThrough Christ our Lord, Amen.",
  },
  {
    title: "Washed clean",
    tradition: "Christian",
    intention: "Forgiveness",
    text: "Lord Jesus, I come to you as I am —\nnothing hidden, nothing withheld.\nYour blood, shed once for all, is enough.\nYour Word declares it: I am forgiven, I am free.\nLet me not carry what you have already carried,\nor drag back the chains you broke at Calvary.\nIn Jesus' name, Amen.",
  },
  {
    title: "Baruch Atah — for Shabbat",
    tradition: "Jewish",
    intention: "Peace",
    text: "Baruch Atah Adonai, Eloheinu Melech HaOlam —\nBlessed are You, Lord our God, Sovereign of the Universe,\nwho sanctifies us with Your commandments\nand commands us to kindle the Shabbat light.\nMay this rest be more than rest —\nmay it be teshuvah, a turning back to what matters.\nAdonai Echad. You are one, and tonight I remember it.\nShalom.",
  },
  {
    title: "Du'a for the seeker",
    tradition: "Islamic",
    intention: "Guidance",
    text: "Bismillah ir-Rahman ir-Raheem.\nAlhamdulillahi Rabbil 'alamin.\nYa Al-Hadi — O Guide of those who are lost —\nI stand at a crossroads I cannot read alone.\nYou know what I do not know;\nYou see what I cannot see.\nGrant me hidaya — the guidance that comes only from You —\nand the sabr to walk the path You illuminate.\nRabbana hab lana min ladunka rahmah.\nAmeen.",
  },
  {
    title: "Metta — for a difficult person",
    tradition: "Buddhist",
    intention: "Forgiveness",
    text: "I take refuge in the Buddha, the Dharma, the Sangha.\nMay I be happy. May I be free from suffering.\nMay this person — whom I struggle to hold with kindness —\nbe happy. May they be free from suffering.\nMay the merit of this aspiration reach them\nas water finds its way through stone.\nMay all beings, without exception,\nabide in equanimity.\nSo may it be.",
  },
  {
    title: "Om Gam Ganapataye — before a new beginning",
    tradition: "Hindu",
    intention: "Guidance",
    text: "Om Gam Ganapataye Namaha.\nGanapati, Remover of Obstacles, Lord of Auspicious Beginnings,\nyour elephant head holds the wisdom of all worlds —\nyour broken tusk the willingness to sacrifice for truth.\nClear the path before me, not with ease,\nbut with the dharma I need to walk it.\nI place this beginning at your lotus feet.\nSarvaṃ tava — all is yours.\nOm Shanti.",
  },
  {
    title: "Turning toward the East",
    tradition: "Indigenous",
    intention: "Strength",
    text: "We turn to the East, where the sun rises, where light begins.\nEagle, carry our prayers upward — we are listening.\nWe turn to the South, where the warmth lives, where things grow.\nWe have received more than we have returned, and we know it.\nWe turn to the West, where the day closes and the ancestors wait.\nWe remember those who walked before us; their strength is in our legs.\nWe turn to the North, where the cold teaches endurance.\nGrandmother Earth, we are your children — hold us accountable.\nWe are here. We are grateful. We will give something back.",
  },
  {
    title: "On paying attention",
    tradition: "Secular",
    intention: "Gratitude",
    text: "I do not know what to call what moves me —\nonly that something does.\nThis morning the light came through the window at an angle\nthat stopped me, and I let it.\nMary Oliver asked: what will you do with your one wild and precious life?\nI do not have a full answer yet.\nBut today I will begin with this: I will notice.\nI will not sleepwalk past the evidence that beauty exists\nand that I am, improbably, here to see it.",
  },
  {
    title: "At the threshold",
    tradition: "Universal",
    intention: "Grief",
    text: "We do not know what waits on the other side of this.\nWe know only that love does not require an answer to continue.\nHold us in the place where words run out —\nwhere the body knows its limits and the heart does not.\nMay those who grieve be met, not with explanations,\nbut with presence: a hand, a silence, a willingness to stay.\nMay the weight of this be shared across every soul\nwho has ever stood where we stand now.",
  },
  {
    title: "Ki Tov — for gratitude",
    tradition: "Jewish",
    intention: "Gratitude",
    text: "Modeh ani lefanecha — I give thanks before You,\nliving and enduring Sovereign,\nfor returning my soul to me this morning.\nThe rabbis say: one who recites a hundred blessings each day\nis filled with gratitude without noticing.\nSo let me begin: Baruch Atah Adonai —\nfor breath, for light, for the ones who slept beside me,\nfor the Torah still making its argument in my chest.\nKi tov. It is good. It is enough.",
  },
  {
    title: "Tonglen — breathing with grief",
    tradition: "Buddhist",
    intention: "Grief",
    text: "Breathing in, I breathe in this sorrow — mine, and all sorrow like it.\nI do not push it away. I let it land.\nBreathing out, I breathe out relief — not forced, not pretended,\nbut whatever small warmth I can honestly offer.\nMay this grief not harden into a wall.\nMay it open into the vast suffering of all beings\nwho have loved and lost and are losing still.\nMay all beings be free from suffering.\nThis breath is for them.",
  },
  {
    title: "Ya Al-Shafi — prayer for healing",
    tradition: "Islamic",
    intention: "Healing",
    text: "Bismillah ir-Rahman ir-Raheem.\nYa Al-Shafi — O Healer of bodies, Healer of hearts —\nyou alone are the cure; medicine is only your instrument.\nWhat the doctors cannot name, You know.\nWhat the tests cannot find, You see.\nGrant shifa — complete healing — if it is Your will,\nand if suffering is written, grant the sabr to bear it with dignity.\nRabbana la tuzigh quloobana — do not let our hearts deviate.\nAmeen.",
  },
];

async function seedCommunityPrayers() {
  try {
    const existing = await db.select().from(communityPrayersTable).limit(1);
    if (existing.length === 0) {
      await db.insert(communityPrayersTable).values(SEED_PRAYERS);
    }
  } catch {
    // DB not available — skip seeding
  }
}

seedCommunityPrayers();

router.get("/prayers/usage", async (req: Request, res: Response) => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Sign in to view usage" });
    return;
  }
  const userId = req.user.id;
  const month = getCurrentMonth();
  try {
    const [count, isPremium] = await Promise.all([
      getUsageCount(userId, month),
      checkPremiumServerSide(userId),
    ]);
    res.json({ count, limit: FREE_LIMIT, month, isPremium: isPremium === true });
  } catch (err) {
    req.log.error({ err }, "Failed to fetch prayer usage");
    res.json({ count: 0, limit: FREE_LIMIT, month, isPremium: false });
  }
});

router.post("/prayers/generate", async (req: Request, res: Response) => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Sign in to generate prayers" });
    return;
  }

  const userId = req.user.id;
  const month = getCurrentMonth();

  // Enforce limits unless premium is positively established (true).
  // false = confirmed free; null = unknown (no DB record + RC down) → treated as free.
  // Previously-confirmed premium users return true from their DB record, so they are never blocked.
  const isPremium = await checkPremiumServerSide(userId);

  let slotReserved = false;
  if (isPremium !== true) {
    const reservation = await tryReserveSlot(userId, month);
    if (!reservation.reserved) {
      res.status(402).json({
        error: `You've used all ${FREE_LIMIT} free prayers this month. Upgrade to generate unlimited prayers.`,
        count: reservation.count,
        limit: FREE_LIMIT,
      });
      return;
    }
    slotReserved = true;
  }

  const { tradition, intentions, tone, context } = req.body as {
    tradition: string;
    intentions: string[];
    tone: string;
    context?: string;
  };

  if (!tradition || !intentions || !tone) {
    if (slotReserved) await releaseSlot(userId, month);
    res.status(400).json({ error: "Missing required fields" });
    return;
  }

  const intentionText = Array.isArray(intentions) ? intentions.join(", ") : intentions;
  const contextLine = context ? `Personal context: ${context}.` : "";

  const TRADITION_VOICES: Record<string, string> = {
    Christian: `This prayer is rooted in broadly Protestant / evangelical Christian faith and must sound unmistakably so.
Address Jesus by name — "Lord Jesus," "Jesus," "Savior" — or address God the Father through Christ. This is a prayer in the Protestant tradition, so Marian language and the intercession of saints do not appear here.
Draw on Scripture cadences in a King James register: the rhythms of the Psalms, the Sermon on the Mount, the Epistles. Language of salvation, grace freely given, the blood of the Cross, the risen Lord, the indwelling Spirit.
Include at least one distinctly Protestant image: the Word made flesh, faith alone (sola fide), the assurance of salvation, Christ as personal Savior, being washed clean.
Close naturally with "In Jesus' name, Amen" or "In the name of the Father, the Son, and the Holy Spirit."`,

    Catholic: `This prayer is rooted in Roman Rite Catholic faith and must sound unmistakably so.
Address God the Father, Jesus Christ, or the Holy Spirit with liturgical weight — "Lord, have mercy," "Christ, have mercy," "Lamb of God." Marian invocations belong here: "Holy Mary, Mother of God," "Our Lady," "Queen of Heaven."
Draw on the cadences of the Roman Rite: the Gloria, the Sanctus, the Confiteor's rhythm of confession. Sacramental language is central — the Eucharist, grace through the sacraments, redemption through Christ's Passion and Resurrection.
The intercession of the saints is natural here: name or invoke a saint fitting the intention if it deepens the prayer.
Doxological endings feel right: "world without end," "through Christ our Lord," or the full Trinitarian doxology. Close with "through Christ our Lord, Amen" or "Glory be to the Father, and to the Son, and to the Holy Spirit."`,

    Jewish: `This prayer is rooted in Jewish faith and must sound unmistakably so.
Open with or anchor in siddur-style address: "Baruch Atah Adonai" (Blessed are You, Lord our God) is the classic formula — use it or echo its cadence. Address the Divine as Adonai, Melech HaOlam (Sovereign of the Universe), or Avinu (Our Father).
Ground the prayer in the themes of the Amidah: healing (refuah), wisdom (da'at), redemption (ge'ula), peace (shalom). Let the Shema's declaration of unity ("Adonai Echad") echo beneath the words where it fits.
If the intention resonates with a holy day, let that season color the prayer: Yom Kippur for forgiveness and teshuvah (return), Passover for freedom, Sukkot for gratitude, Shabbat for rest.
The tradition of wrestling with God — as in the Psalms and Job — is welcome: honest grievance, doubt, and petition are all prayers. Weave in Hebrew terms where they enrich: Chesed (steadfast love), Rachamim (compassion), Teshuvah (return), Am Yisrael (the people of Israel).`,

    Islamic: `This prayer is rooted in Islamic faith and must sound unmistakably so. It should feel like sincere du'a — private supplication offered after salah, intimate and direct.
Open with hamd — praise of Allah: echo the spirit of "Alhamdulillah" (All praise is due to Allah) or "Bismillah ir-Rahman ir-Raheem" (In the name of Allah, the Most Gracious, the Most Merciful).
Address Allah by one or more of the 99 Beautiful Names appropriate to the intention: Ar-Rahman (the Merciful) for mercy, Al-Shafi (the Healer) for healing, Al-Hadi (the Guide) for guidance, Al-Qadir (the All-Powerful) for strength, As-Salam (the Source of Peace) for peace, Al-Ghaffar (the Ever-Forgiving) for forgiveness.
Use "Ya Allah" or "O Allah" naturally in direct address. Weave in Quranic phrasing where it feels organic. Draw on the concepts of tawakkul (trust in Allah), sabr (patient perseverance), shukr (gratitude), and istighfar (seeking forgiveness) where they fit.
Close with a "Rabbana" petition (O our Lord…) and "Ameen."`,

    Buddhist: `This prayer is rooted in Buddhist practice and must sound unmistakably so. Do not address a personal God — no "Lord," no "God."
Choose the form that best fits the intention:
— For peace, compassion, or lovingkindness: use metta (loving-kindness) language and the Four Immeasurables as your structural anchor: "May all beings be happy (sukha); may all beings be free from suffering (dukkha); may all beings rejoice in the well-being of others (mudita); may all beings abide in equanimity (upekkha)." You need not recite all four — let the intention guide which to foreground.
— For grief or carrying another's pain: use tonglen form — the practice of breathing in suffering and breathing out relief: "Breathing in, I hold this sorrow; breathing out, I offer ease."
— For a completed practice or in honor of another: use dedication of merit: "May the merit of this aspiration reach all beings without exception, that they may be free."
Refuge-taking language may open or close: "I take refuge in the Buddha, the Dharma, the Sangha" sets the ground beautifully. Draw on Buddhist terms where they deepen the prayer: karuna (compassion), metta (loving-kindness), bodhi (awakening), anicca (impermanence), the middle way.`,

    Hindu: `This prayer is rooted in Hindu devotion and must sound unmistakably so. It should feel like bhakti poetry — full of love, surrender, and vivid imagery of the Divine.
Open with Om or a mantra-like invocation that names the deity: "Om Gam Ganapataye Namaha" for Ganesha; "Om Shri Mahalakshmyai Namaha" for Lakshmi. The opening line should feel like it could be sung.
Choose a deity precisely matched to the intention, and address that deity by their epithets — not just by name:
— Ganesha / Ganapati, Remover of Obstacles, Lord of New Beginnings (for new starts, courage, removing blocks)
— Lakshmi / Shri, Goddess of Abundance, Lotus-Born (for gratitude, prosperity, beauty)
— Shiva / Mahadeva, Lord of the Dance, the Great Dissolver (for strength, release, transformation)
— Saraswati / Vani, Goddess of Wisdom and the Sacred Word (for guidance, learning, clarity)
— Durga / Mahishasuramardini, the Fierce Protector (for protection, courage, grief)
— Hanuman / Mahavira, the Devoted (for strength, devotion)
— Brahman, the Formless One, the All-pervading (for universal prayers)
Weave in Sanskrit naturally: dharma, atman, shakti, puja, bhakti, moksha. Close with Namaste, "Om Shanti Shanti Shanti," or a surrender phrase: "Sarvaṃ tava — all is yours."`,

    Indigenous: `This prayer is rooted in Indigenous spiritual relationship with the living world and must feel unmistakably so. It is spoken aloud, in circle, in the present tense, with the land as witness.
Address specific presences — do not speak to a distant God or to "nature" in the abstract. Address the four directions (East, South, West, North) by their gifts; address the Earth as a living grandmother; address specific elements: Water that remembers, Fire that transforms, Wind that carries, Stone that endures. Address the Ancestors by their presence, not their absence.
The prayer must enact reciprocity: name what has been received and offer something in return — gratitude, attention, care, a promise of stewardship. We are not separate from this web; we are accountable to it.
Let the prayer be grounded in the particular — a specific season, an animal that has shown itself, a plant in bloom, a river, a mountain. The sacred is not elsewhere; it is here.
The voice is present, communal where it fits ("we," not only "I"), and ancient without being archaic. It should feel like it has been said before, around many fires, and is being said again now.`,

    Secular: `This prayer is written for someone with no religious belief and must feel warmly humanist — no God, no supernatural address, no afterlife.
Speak to what is real and present: other people, the body, the passing of time, memory, the fact of being alive right now. The prayer may address the self, "the world," "what is," "the living," or no one in particular — it is an aspiration, a reckoning, a declaration.
The models here are Marcus Aurelius writing in his journal, Mary Oliver walking through a field, Simone Weil on attention, Rainer Maria Rilke on living the questions. The beauty comes from clarity, from honest naming of difficulty and goodness, from solidarity with other human beings facing the same mortal life.
Avoid religious vocabulary entirely: no grace, no soul in the theological sense, no blessed, no sacred. The dignity comes from the ordinary: a hand, a breath, a morning, a choice.
This is not nihilism — it is the prayer of someone who finds the world, as it is, enough to be grateful for and worth caring about.`,

    Universal: `This prayer is intentionally interfaith and non-denominational — it must feel at home across many traditions without belonging exclusively to any.
Do not use vocabulary owned by one tradition: no Jesus, no Allah, no Adonai, no Om, no specifically Christian, Islamic, Jewish, or Hindu terms. Do not use "the Universe" in a New Age sense.
You may address "the sacred," "the holy," "whatever holds us," "the mystery at the center of things," "what is greater than we are," or simply speak as aspiration with no address at all.
The prayer should feel like it could be read aloud at a multi-faith memorial, a hospital chapel, or a gathering of people from many different beliefs — honest, warm, and wide enough to hold them all.
Favor concrete human imagery over abstract spiritual language: a body, a hand, a threshold, a season, a breath. Unlike the Secular tradition, the Universal prayer does not exclude the existence of the sacred — it simply refuses to name it in terms that belong to one tradition alone.`,
  };

  const FALLBACK_VOICE = `Write in the spirit of the stated tradition as authentically as possible.
Use the sacred vocabulary, address forms, and imagery associated with that tradition.
The prayer should feel unmistakably rooted in that tradition's specific practice, not generic spirituality.`;

  const voiceGuide = TRADITION_VOICES[tradition] ?? FALLBACK_VOICE;

  const systemPrompt = `You are a skilled, tradition-literate prayer composer. You write prayers that are original, emotionally resonant, and unmistakably rooted in the specific tradition requested.

${voiceGuide}

Rules that always apply:
- Write with concrete imagery, not clichés. Every line should earn its place.
- Honor the breath and rhythm of the tradition's sacred literature.
- The prayer must be 5–9 lines long.
- Return ONLY the prayer text — no title, no preamble, no closing note, no quotation marks.`;

  try {
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: `Write a ${tradition} prayer.
Intention: ${intentionText}.
Tone: ${tone}.
${contextLine}
Use the specific sacred language, liturgical forms, address forms, and imagery of the ${tradition} tradition — not just the label. A practitioner of this tradition should immediately recognize it as their own.`,
        },
      ],
    });

    const block = message.content[0];
    const prayer = block.type === "text" ? block.text.trim() : "";

    res.json({ prayer });
  } catch (err) {
    if (slotReserved) await releaseSlot(userId, month);
    req.log.error({ err }, "Prayer generation failed");
    res.status(500).json({ error: "Something got quiet. Please try again." });
  }
});

router.get("/prayers/browse", async (req: Request, res: Response) => {
  try {
    const tradition = req.query["tradition"] as string | undefined;
    const prayers =
      tradition && tradition !== "All"
        ? await db.select().from(communityPrayersTable).where(eq(communityPrayersTable.tradition, tradition))
        : await db.select().from(communityPrayersTable);

    res.json({
      prayers: prayers.map((p) => ({
        id: p.id,
        title: p.title,
        tradition: p.tradition,
        intention: p.intention,
        text: p.text,
        createdAt: p.createdAt.toISOString(),
      })),
    });
  } catch {
    res.json({
      prayers: SEED_PRAYERS.map((p, i) => ({ ...p, id: i + 1, createdAt: new Date().toISOString() })),
    });
  }
});

router.post("/prayers/browse", async (req: Request, res: Response) => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Sign in to submit prayers" });
    return;
  }

  const { title, tradition, intention, text } = req.body as {
    title?: string;
    tradition?: string;
    intention?: string;
    text?: string;
  };

  if (!title?.trim() || !tradition?.trim() || !intention?.trim() || !text?.trim()) {
    res.status(400).json({ error: "All fields (title, tradition, intention, text) are required" });
    return;
  }

  try {
    const [inserted] = await db
      .insert(communityPrayersTable)
      .values({
        title: title.trim(),
        tradition: tradition.trim(),
        intention: intention.trim(),
        text: text.trim(),
      })
      .returning();

    res.status(201).json({
      id: inserted.id,
      title: inserted.title,
      tradition: inserted.tradition,
      intention: inserted.intention,
      text: inserted.text,
      createdAt: inserted.createdAt.toISOString(),
    });
  } catch (err) {
    req.log.error({ err }, "Failed to submit community prayer");
    res.status(500).json({ error: "Could not submit prayer" });
  }
});

export default router;
