import { useEffect, useState } from "react";
import { useNotificationStore } from "@/stores/notificationStore";

export default function Notification() {
  const { message, type, clear } = useNotificationStore();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        clear();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [message, clear]);

  if (!message || !type) return null;

  return (
    <div
      className={`fixed top-4 right-4 z-50 transform transition-all duration-300 ease-in-out ${
        isVisible ? "translate-x-0 opacity-100" : "translate-x-[120%] opacity-0"
      }`}
    >
      <div
        className={`p-4 rounded-lg shadow-lg relative overflow-hidden ${
          type === "success"
            ? "bg-green-100 border border-green-400 text-green-700"
            : "bg-red-100 border border-red-400 text-red-700"
        }`}
      >
        <div className="flex items-center gap-2">
          {type === "success" ? (
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          ) : (
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          )}
          <p className="text-sm font-medium">{message}</p>
        </div>
        <div className="absolute bottom-0 left-0 h-1 w-full bg-gray-200">
          <div
            className={`h-full ${
              type === "success" ? "bg-green-500" : "bg-red-500"
            } animate-progress origin-left`}
          />
        </div>
      </div>
    </div>
  );
}
