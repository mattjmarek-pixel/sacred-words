/**
 * Development-only integration verification against the running shared proxy.
 * Creates isolated Clerk test users and removes only its own fixtures.
 * Run: pnpm --filter @workspace/scripts exec tsx ../artifacts/api-server/tests/clerk-migration.mts
 */
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { createClerkClient } from "@clerk/express";
import {
  db, pool, usersTable, communityPrayersTable, prayerUsageTable,
  prayerReportsTable, userBlocksTable, userPremiumStatusTable,
} from "@workspace/db";
import { and, eq, inArray, or, sql } from "drizzle-orm";

if (process.env.REPLIT_DEPLOYMENT || !process.env.CLERK_SECRET_KEY?.startsWith("sk_test_")) {
  throw new Error("This verification is allowed only with Development Clerk keys");
}
const domain = process.env.REPLIT_DEV_DOMAIN;
assert(domain?.endsWith(".replit.dev"), "Development API domain required");
const base = `https://${domain}/api`;
const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });
const createdUsers: string[] = [];
const sessions: string[] = [];
const createdPrayers: number[] = [];

async function sessionFor(id: string) {
  const session = await clerk.sessions.createSession({ userId: id });
  sessions.push(session.id);
  const { jwt } = await clerk.sessions.getToken(session.id);
  const claims = JSON.parse(Buffer.from(jwt.split(".")[1]!, "base64url").toString());
  return { jwt, claims };
}

async function api(path: string, jwt?: string, body?: unknown, cookie = false) {
  const headers: Record<string, string> = {};
  if (jwt) headers[cookie ? "Cookie" : "Authorization"] = cookie ? `__session=${jwt}` : `Bearer ${jwt}`;
  if (body !== undefined) headers["Content-Type"] = "application/json";
  const response = await fetch(`${base}${path}`, {
    method: body !== undefined ? "POST" : "GET",
    headers, body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  const data = await response.json();
  return { status: response.status, data };
}

try {
  for (const path of ["/prayers/generate", "/prayers/submit", "/prayers/browse", "/prayers/1/report", "/prayers/1/block-author"]) {
    assert.equal((await api(path, undefined, {})).status, 401, `signed-out ${path}`);
  }
  console.log("PASS: signed-out generate, both submit routes, report and block return 401");

  const migrated = (await clerk.users.getUserList({ limit: 100 })).data.find((user) => !!user.externalId);
  assert(migrated?.externalId, "An existing migrated Development account is required");
  const existingId = migrated.externalId;
  const beforeUsage = await db.select().from(prayerUsageTable).where(eq(prayerUsageTable.userId, existingId));
  const beforePrayers = await db.select({ id: communityPrayersTable.id }).from(communityPrayersTable)
    .where(eq(communityPrayersTable.submittedBy, existingId));
  const existingSession = await sessionFor(migrated.id);
  assert.equal(existingSession.claims.userId, existingId, "Migrated session userId must equal the original ID");
  console.log(`Verified migrated account: Replit externalId=${existingId}; session userId=${existingSession.claims.userId}`);
  const usage = await api("/prayers/usage", existingSession.jwt);
  assert.equal(usage.status, 200);
  const monthUsage = beforeUsage.find((row) => row.month === usage.data.month)?.count ?? 0;
  assert.equal(usage.data.generationsThisMonth, monthUsage);
  assert.equal((await api("/prayers/browse", existingSession.jwt)).status, 200);
  assert.deepEqual(await db.select().from(prayerUsageTable).where(eq(prayerUsageTable.userId, existingId)), beforeUsage);
  assert.deepEqual(await db.select({ id: communityPrayersTable.id }).from(communityPrayersTable)
    .where(eq(communityPrayersTable.submittedBy, existingId)), beforePrayers);
  console.log("PASS: migrated session resolves original ID; existing usage and prayer ownership unchanged");

  for (let i = 0; i < 2; i++) {
    const user = await clerk.users.createUser({
      emailAddress: [`migration-${randomUUID()}@example.com`],
      firstName: "Migration", lastName: "Verification", skipPasswordRequirement: true,
    });
    createdUsers.push(user.id);
  }
  const [authorId, readerId] = createdUsers as [string, string];
  const author = await sessionFor(authorId);
  const reader = await sessionFor(readerId);
  assert.equal(author.claims.userId, authorId, "New account session userId must equal Clerk native ID");
  console.log(`Verified new account: Clerk user.id=${authorId}; session userId=${author.claims.userId}`);
  for (const [id, session] of [[authorId, author], [readerId, reader]] as const) {
    assert.equal(session.claims.sub, id);
    assert.equal(session.claims.userId || session.claims.sub, id, "New account must resolve to its Clerk ID");
    const responses = await Promise.all(Array.from({ length: 4 }, () => api("/prayers/usage", session.jwt)));
    assert(responses.every((response) => response.status === 200), "Concurrent first requests must provision safely");
    const rows = await db.select().from(usersTable).where(eq(usersTable.id, id));
    assert.equal(rows.length, 1);
    assert.equal(rows[0]?.email, null, "Nullable identity fields must not be synced locally");
    // Browser cookies also require Clerk's development-browser cookie.
    // Exercise that real cookie jar in the browser test, not a synthetic cookie.
  }
  console.log("PASS: new accounts use Clerk IDs, concurrent JIT creates one row, native bearer transport accepted");

  assert.equal((await api("/prayers/submit", reader.jwt, {})).status, 403, "Nonpremium submission remains gated");
  const month = new Date().toISOString().slice(0, 7);
  await db.insert(prayerUsageTable).values({ userId: readerId, month, count: 3 });
  const limited = await api("/prayers/generate", reader.jwt, { tradition: "Universal", intentions: ["Peace"], tone: "Gentle" });
  assert.equal(limited.status, 403);
  assert.equal(limited.data.error, "free_limit_reached");
  const unavailableTradition = await api("/prayers/generate", reader.jwt, { tradition: "Buddhist", intentions: ["Peace"], tone: "Gentle" });
  assert.equal(unavailableTradition.status, 400);
  assert.equal(unavailableTradition.data.error, "invalid_tradition");
  console.log("PASS: premium community checks, free-tier generation limit, and hidden tradition rejection preserved");

  // The existing premium fallback supports isolated Development test entitlements.
  await db.insert(userPremiumStatusTable).values({ userId: authorId, isPremium: true })
    .onConflictDoUpdate({ target: userPremiumStatusTable.userId, set: { isPremium: true } });
  // With RevenueCat unconfigured, usage-only checks do not cache fallback results.
  const submitted = await api("/prayers/submit", author.jwt, {
    title: `Development verification ${randomUUID()}`, tradition: "Universal", intention: "Peace",
    text: "May we greet one another with kindness, patience, and peace. May those who feel alone find comfort and friendship today.",
  });
  assert.equal(submitted.status, 201, `Community submission: ${JSON.stringify(submitted.data)}`);
  const prayerId = submitted.data.id;
  assert.equal(typeof prayerId, "number");
  createdPrayers.push(prayerId);
  const [prayer] = await db.select().from(communityPrayersTable).where(eq(communityPrayersTable.id, prayerId));
  assert.equal(prayer?.submittedBy, authorId);
  assert.equal((await api(`/prayers/${prayerId}/report`, reader.jwt, { reason: "Other" })).status, 200);
  assert.equal((await api(`/prayers/${prayerId}/block-author`, reader.jwt, {})).status, 200);
  assert.equal((await db.select().from(prayerReportsTable).where(and(eq(prayerReportsTable.prayerId, prayerId), eq(prayerReportsTable.reporterUserId, readerId)))).length, 1);
  assert.equal((await db.select().from(userBlocksTable).where(and(eq(userBlocksTable.blockerUserId, readerId), eq(userBlocksTable.blockedUserId, authorId)))).length, 1);
  const fks = await db.execute(sql`SELECT conname FROM pg_constraint WHERE contype = 'f' AND confrelid = 'users'::regclass`);
  assert(fks.rows.length >= 4, "Existing user foreign keys must remain in place");
  console.log("PASS: new-user submit, report and block writes succeed with all user foreign keys retained");
} finally {
  if (createdPrayers.length) await db.delete(communityPrayersTable).where(inArray(communityPrayersTable.id, createdPrayers));
  if (createdUsers.length) {
    await db.delete(prayerReportsTable).where(inArray(prayerReportsTable.reporterUserId, createdUsers));
    await db.delete(userBlocksTable).where(or(inArray(userBlocksTable.blockerUserId, createdUsers), inArray(userBlocksTable.blockedUserId, createdUsers)));
    await db.delete(prayerUsageTable).where(inArray(prayerUsageTable.userId, createdUsers));
    await db.delete(userPremiumStatusTable).where(inArray(userPremiumStatusTable.userId, createdUsers));
    await db.delete(usersTable).where(inArray(usersTable.id, createdUsers));
  }
  for (const id of sessions) await clerk.sessions.revokeSession(id);
  for (const id of createdUsers) await clerk.users.deleteUser(id);
  await pool.end();
}
