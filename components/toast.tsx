"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { CheckIcon } from "./icons";

type Toast = { id: number; message: string; onUndo?: () => void };
type Show = (message: string, onUndo?: () => void) => void;

const ToastContext = createContext<Show>(() => {});

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<Toast | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const show = useCallback<Show>((message, onUndo) => {
    clearTimeout(timer.current);
    setToast({ id: Date.now(), message, onUndo });
    timer.current = setTimeout(() => setToast(null), 4000);
  }, []);

  useEffect(() => () => clearTimeout(timer.current), []);

  return (
    <ToastContext value={show}>
      {children}
      <div
        role="status"
        className="pointer-events-none fixed inset-x-4 bottom-24 z-20 flex justify-center sm:bottom-7"
      >
        {toast && (
          <div
            key={toast.id}
            className="pointer-events-auto flex animate-toast items-center gap-3 rounded-full bg-ink py-2 pr-2 pl-5 text-[15px] font-bold text-canvas shadow-[0_12px_30px_rgb(60_35_15/0.25)]"
          >
            <CheckIcon className="size-5 flex-none stroke-[2.6] text-check" />
            <span>{toast.message}</span>
            {toast.onUndo && (
              <button
                type="button"
                onClick={() => {
                  clearTimeout(timer.current);
                  setToast(null);
                  toast.onUndo?.();
                }}
                className="min-h-10 flex-none cursor-pointer rounded-full bg-ink-2 px-4 text-sm font-extrabold"
              >
                Undo
              </button>
            )}
          </div>
        )}
      </div>
    </ToastContext>
  );
}
