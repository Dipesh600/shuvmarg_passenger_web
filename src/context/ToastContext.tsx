"use client";

import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X, Send } from "lucide-react";

export type ToastType = "success" | "error" | "info" | "warning" | "otp";

export interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  showToast: (message: string, type?: ToastType) => void;
  toast: {
    success: (message: string) => void;
    error: (message: string) => void;
    info: (message: string) => void;
    warning: (message: string) => void;
    otp: (message: string) => void;
  };
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const activeToastsRef = useRef<ToastItem[]>([]);
  const timersRef = useRef(new Map<string, ReturnType<typeof setTimeout>>());

  useEffect(() => {
    activeToastsRef.current = toasts;
  }, [toasts]);

  const removeToast = useCallback((id: string) => {
    const timer = timersRef.current.get(id);
    if (timer) clearTimeout(timer);
    timersRef.current.delete(id);
    activeToastsRef.current = activeToastsRef.current.filter(
      (toast) => toast.id !== id
    );
    setToasts(activeToastsRef.current);
  }, []);

  const showToast = useCallback(
    (message: string, type: ToastType = "info") => {
      if (activeToastsRef.current.some((t) => t.message === message)) {
        return; // Prevent duplicate toast messages
      }

      const id = crypto.randomUUID();
      const next = [
        ...activeToastsRef.current.slice(-4),
        { id, message, type },
      ];
      activeToastsRef.current = next;
      setToasts(next);

      const timer = setTimeout(() => {
        removeToast(id);
      }, 4500);
      timersRef.current.set(id, timer);
    },
    [removeToast]
  );

  useEffect(() => {
    const timers = timersRef.current;
    return () => {
      for (const timer of timers.values()) clearTimeout(timer);
      timers.clear();
    };
  }, []);

  const toast = {
    success: useCallback((msg: string) => showToast(msg, "success"), [showToast]),
    error: useCallback((msg: string) => showToast(msg, "error"), [showToast]),
    info: useCallback((msg: string) => showToast(msg, "info"), [showToast]),
    warning: useCallback((msg: string) => showToast(msg, "warning"), [showToast]),
    otp: useCallback((msg: string) => showToast(msg, "otp"), [showToast]),
  };

  return (
    <ToastContext.Provider value={{ showToast, toast }}>
      {children}
      {/* Toast Render Portal / Overlay */}
      <div className="fixed top-5 right-5 z-[99999] flex flex-col gap-3 max-w-sm w-full pointer-events-none px-4 sm:px-0">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              className={`pointer-events-auto flex items-center gap-3 p-4 rounded-2xl border shadow-[0_8px_30px_rgba(0,0,0,0.08)] backdrop-blur-md transition-all ${
                t.type === "otp"
                  ? "bg-[#FDF4F4] border-[#F0CACA] text-[#7A1D1B]"
                  : t.type === "success"
                  ? "bg-[#F2F9F4] border-[#C2E8CE] text-[#1B4D2E]"
                  : t.type === "error"
                  ? "bg-[#FDF2F2] border-[#F8C9C7] text-[#9A2622]"
                  : t.type === "warning"
                  ? "bg-[#FFF9EE] border-[#FFE0A0] text-[#644A1F]"
                  : "bg-[#FFFDF9] border-neutral-200 text-[#171717]"
              }`}
            >
              {/* Icon */}
              <div className="shrink-0">
                {t.type === "otp" && <Send className="w-5 h-5 text-[#D94328] animate-pulse" />}
                {t.type === "success" && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
                {t.type === "error" && <AlertCircle className="w-5 h-5 text-red-600" />}
                {t.type === "warning" && <AlertTriangle className="w-5 h-5 text-[#C99A4A]" />}
                {t.type === "info" && <Info className="w-5 h-5 text-[#7A1D1B]" />}
              </div>

              {/* Message */}
              <div className="flex-1 text-sm font-semibold leading-snug">
                {t.message}
              </div>

              {/* Close Button */}
              <button
                onClick={() => removeToast(t.id)}
                className="shrink-0 p-1 rounded-lg opacity-60 hover:opacity-100 hover:bg-black/5 transition-all text-current"
                aria-label="Close Toast"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
