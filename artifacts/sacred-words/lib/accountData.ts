import { clearSavedPrayers } from "@/hooks/useDatabase";
import { clearStreak } from "@/hooks/useStreak";
import { clearTraditionHistory } from "@/hooks/useTraditionHistory";
import { clearAccountNotificationData } from "@/lib/notifications";

export async function clearLocalAccountData(): Promise<void> {
  await Promise.all([
    clearSavedPrayers(),
    clearStreak(),
    clearTraditionHistory(),
    clearAccountNotificationData(),
  ]);
}
