import { createClerkClient, getAuth } from "@clerk/express";
import { db } from "@workspace/db";
import {
  communityPrayersTable,
  prayerReportsTable,
  prayerUsageTable,
  sessionsTable,
  userBlocksTable,
  userPremiumStatusTable,
  usersTable,
} from "@workspace/db";
import { DeleteAccountResponse } from "@workspace/api-zod";
import { eq, inArray, or, sql } from "drizzle-orm";
import { Router, type IRouter } from "express";

const router: IRouter = Router();

router.delete("/account", async (req, res): Promise<void> => {
  const clerkUserId = getAuth(req).userId;
  const appUserId = req.dbUser?.id;

  if (!clerkUserId || !appUserId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    await db.transaction(async (tx) => {
      const [authoredReports, submittedPrayers] = await Promise.all([
        tx
          .select({ prayerId: prayerReportsTable.prayerId })
          .from(prayerReportsTable)
          .where(eq(prayerReportsTable.reporterUserId, appUserId)),
        tx
          .select({ id: communityPrayersTable.id })
          .from(communityPrayersTable)
          .where(eq(communityPrayersTable.submittedBy, appUserId)),
      ]);
      const submittedPrayerIds = new Set(submittedPrayers.map(({ id }) => id));
      const otherReportedPrayerIds = authoredReports
        .map(({ prayerId }) => prayerId)
        .filter((prayerId) => !submittedPrayerIds.has(prayerId));

      if (otherReportedPrayerIds.length > 0) {
        await tx
          .update(communityPrayersTable)
          .set({
            reportCount: sql`GREATEST(${communityPrayersTable.reportCount} - 1, 0)`,
          })
          .where(inArray(communityPrayersTable.id, otherReportedPrayerIds));
      }

      await tx
        .delete(prayerReportsTable)
        .where(eq(prayerReportsTable.reporterUserId, appUserId));

      await tx
        .delete(userBlocksTable)
        .where(
          or(
            eq(userBlocksTable.blockerUserId, appUserId),
            eq(userBlocksTable.blockedUserId, appUserId),
          ),
        );

      await tx
        .delete(communityPrayersTable)
        .where(eq(communityPrayersTable.submittedBy, appUserId));

      await tx
        .delete(prayerUsageTable)
        .where(eq(prayerUsageTable.userId, appUserId));

      await tx
        .delete(userPremiumStatusTable)
        .where(eq(userPremiumStatusTable.userId, appUserId));

      await tx
        .delete(sessionsTable)
        .where(sql`${sessionsTable.sess}->'user'->>'id' = ${appUserId}`);

      await tx.delete(usersTable).where(eq(usersTable.id, appUserId));
    });
  } catch (err) {
    req.log.error({ err }, "Failed to delete account data");
    res.status(500).json({ error: "account_deletion_failed" });
    return;
  }

  try {
    const clerkClient = createClerkClient({
      secretKey: process.env.CLERK_SECRET_KEY,
    });
    await clerkClient.users.deleteUser(clerkUserId);
  } catch (err) {
    req.log.error({ err }, "App data was deleted but Clerk account deletion failed");
  }

  res.status(200).json(DeleteAccountResponse.parse({ deleted: true }));
});

export default router;
