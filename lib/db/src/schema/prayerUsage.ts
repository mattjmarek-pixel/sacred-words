import { integer, pgTable, serial, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";

export const prayerUsageTable = pgTable(
  "prayer_usage",
  {
    id: serial("id").primaryKey(),
    userId: text("user_id").notNull(),
    month: text("month").notNull(),
    count: integer("count").notNull().default(0),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("prayer_usage_user_month_idx").on(table.userId, table.month),
  ],
);

export type PrayerUsage = typeof prayerUsageTable.$inferSelect;
