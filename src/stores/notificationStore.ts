import { create } from "zustand";

interface NotificationState {
  message: string | null;
  type: "success" | "error" | null;
  success: (message: string) => void;
  error: (message: string) => void;
  clear: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  message: null,
  type: null,
  success: (message: string) => set({ message, type: "success" }),
  error: (message: string) => set({ message, type: "error" }),
  clear: () => set({ message: null, type: null }),
}));
