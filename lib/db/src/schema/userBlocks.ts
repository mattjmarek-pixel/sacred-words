import { timestamp, varchar, pgTable, uniqueIndex } from "drizzle-orm/pg-core";
import { usersTable } from "./auth";

export const userBlocksTable = pgTable(
  "user_blocks",
  {
    blockerUserId: varchar("blocker_user_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    blockedUserId: varchar("blocked_user_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("user_blocks_blocker_blocked_unique").on(
      table.blockerUserId,
      table.blockedUserId,
    ),
  ],
);
