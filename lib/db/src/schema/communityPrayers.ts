import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { usersTable } from "./auth";

export const communityPrayerStatusEnum = pgEnum("community_prayer_status", [
  "approved",
  "pending",
  "rejected",
]);

export const communityPrayersTable = pgTable("community_prayers", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  tradition: text("tradition").notNull(),
  intention: text("intention").notNull(),
  text: text("text").notNull(),
  isUserSubmitted: boolean("is_user_submitted").default(false).notNull(),
  submittedBy: varchar("submitted_by").references(() => usersTable.id, {
    onDelete: "set null",
  }),
  status: communityPrayerStatusEnum("status").default("approved").notNull(),
  reportCount: integer("report_count").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertCommunityPrayerSchema = createInsertSchema(communityPrayersTable).omit({
  id: true,
  createdAt: true,
  submittedBy: true,
  status: true,
  reportCount: true,
});
export type InsertCommunityPrayer = z.infer<typeof insertCommunityPrayerSchema>;
export type CommunityPrayer = typeof communityPrayersTable.$inferSelect;
export type CommunityPrayerStatus = (typeof communityPrayerStatusEnum.enumValues)[number];
