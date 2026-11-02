import { getAuth } from "@clerk/express";
import { db, usersTable, type User } from "@workspace/db";
import { eq } from "drizzle-orm";
import type { RequestHandler } from "express";

declare global {
  namespace Express {
    interface Request {
      dbUser?: User;
    }
  }
}

/** Only call after Clerk has cryptographically validated the session. */
export const provisionAppUser: RequestHandler = async (req, _res, next) => {
  try {
    const auth = getAuth(req);
    if (!auth.userId) {
      next();
      return;
    }
    // Migrated accounts retain their original ID; new accounts use Clerk's ID.
    const appUserId = auth.sessionClaims?.userId || auth.userId;
    if (typeof appUserId !== "string") throw new Error("Invalid app user ID claim");
    let [user] = await db.select().from(usersTable).where(eq(usersTable.id, appUserId)).limit(1);
    if (!user) {
      [user] = await db.insert(usersTable).values({ id: appUserId })
        .onConflictDoNothing({ target: usersTable.id }).returning();
      if (!user) {
        [user] = await db.select().from(usersTable).where(eq(usersTable.id, appUserId)).limit(1);
      }
    }
    if (!user) throw new Error("Unable to provision app user");
    req.dbUser = user;
    next();
  } catch (error) {
    next(error);
  }
};
