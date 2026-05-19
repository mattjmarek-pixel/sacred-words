import { boolean, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const userPremiumStatusTable = pgTable("user_premium_status", {
  userId: text("user_id").primaryKey(),
  isPremium: boolean("is_premium").notNull(),
  verifiedAt: timestamp("verified_at").defaultNow().notNull(),
});

export type UserPremiumStatus = typeof userPremiumStatusTable.$inferSelect;
