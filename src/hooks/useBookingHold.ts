import { useCallback, useEffect, useRef, useState } from "react";
import {
  PreparedBooking,
  preparePassengerBooking,
  releasePassengerBookingHold,
} from "@/lib/booking";

export function useBookingHold(onExpired: () => void) {
  const [hold, setHold] = useState<PreparedBooking | null>(null);
  const [secondsRemaining, setSecondsRemaining] = useState(0);
  const holdRef = useRef<PreparedBooking | null>(null);

  const clear = useCallback(() => {
    holdRef.current = null;
    setHold(null);
    setSecondsRemaining(0);
  }, []);

  const prepare = useCallback(async (tripId: string, seats: string[]) => {
    const prepared = await preparePassengerBooking(tripId, seats);
    holdRef.current = prepared;
    setHold(prepared);
    setSecondsRemaining(
      Math.max(0, Math.ceil((new Date(prepared.expiresAt).getTime() - Date.now()) / 1000))
    );
    return prepared;
  }, []);

  const release = useCallback(async () => {
    const current = holdRef.current;
    clear();
    if (current) await releasePassengerBookingHold(current.tempBookingId);
  }, [clear]);

  useEffect(() => {
    if (!hold) return;
    const update = () => {
      const remaining = Math.max(
        0,
        Math.ceil((new Date(hold.expiresAt).getTime() - Date.now()) / 1000)
      );
      setSecondsRemaining(remaining);
      if (remaining === 0) {
        clear();
        onExpired();
      }
    };
    update();
    const interval = window.setInterval(update, 1000);
    return () => window.clearInterval(interval);
  }, [clear, hold, onExpired]);

  return { hold, secondsRemaining, prepare, release, clear };
}
