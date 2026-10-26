import { integer, pgTable, text, timestamp, varchar, uniqueIndex } from "drizzle-orm/pg-core";
import { communityPrayersTable } from "./communityPrayers";
import { usersTable } from "./auth";

export const prayerReportsTable = pgTable(
  "prayer_reports",
  {
    prayerId: integer("prayer_id")
      .notNull()
      .references(() => communityPrayersTable.id, { onDelete: "cascade" }),
    reporterUserId: varchar("reporter_user_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    reason: text("reason").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("prayer_reports_prayer_reporter_unique").on(
      table.prayerId,
      table.reporterUserId,
    ),
  ],
);
