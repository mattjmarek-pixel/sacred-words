import { useState, useCallback, useRef } from "react";

export interface Toast {
  id: string;
  message: string;
  type?: "success" | "error" | "info";
}

export function useToast() {
  const [toast, setToast] = useState<Toast | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback(
    (message: string, type: Toast["type"] = "success") => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      setToast({
        id: Date.now().toString(),
        message,
        type,
      });
      timerRef.current = setTimeout(() => {
        setToast(null);
      }, 2500);
    },
    []
  );

  const hideToast = useCallback(() => {
    setToast(null);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  }, []);

  return { toast, showToast, hideToast };
}
