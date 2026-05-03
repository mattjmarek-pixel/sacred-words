import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const communityPrayersTable = pgTable("community_prayers", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  tradition: text("tradition").notNull(),
  intention: text("intention").notNull(),
  text: text("text").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertCommunityPrayerSchema = createInsertSchema(communityPrayersTable).omit({ id: true, createdAt: true });
export type InsertCommunityPrayer = z.infer<typeof insertCommunityPrayerSchema>;
export type CommunityPrayer = typeof communityPrayersTable.$inferSelect;
