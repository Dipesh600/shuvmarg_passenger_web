"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ApiRequestError } from "@/lib/api";
import { esewaResultHeading, isPendingEsewaResult } from "@/lib/esewa-result";
import {
  ConfirmedBooking,
  finalizeEsewaCheckout,
} from "@/lib/booking";

interface Props {
  attempt: string;
  outcome: string;
}

export default function EsewaResultClient({ attempt }: Props) {
  const searchParams = useSearchParams();
  const started = useRef(false);
  const [booking, setBooking] = useState<ConfirmedBooking | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<string | undefined>();

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    const responseData = searchParams.get("data");

    async function finalize(retries = 0): Promise<void> {
      try {
        const confirmed = await finalizeEsewaCheckout(
          attempt,
          responseData
        );
        setBooking(confirmed);
      } catch (err) {
        if (
          err instanceof ApiRequestError &&
          isPendingEsewaResult(err.errorCode) &&
          retries < 10
        ) {
          await new Promise((resolve) => window.setTimeout(resolve, 2000));
          return finalize(retries + 1);
        }
        const message =
          err instanceof ApiRequestError
            ? err.message
            : "We could not confirm your payment. Please contact support before paying again.";
        setError(message);
        setErrorCode(err instanceof ApiRequestError ? err.errorCode : undefined);
      }
    }
    void finalize();
  }, [attempt, searchParams]);

  const isLoading = !booking && !error;
  return (
    <main className="min-h-screen bg-[#EED9BD] px-4 py-16">
      <section className="mx-auto max-w-xl rounded-3xl border border-[#D8C5A8] bg-white p-8 text-center shadow-xl">
        {isLoading && (
          <>
            <div className="mx-auto mb-5 h-12 w-12 animate-spin rounded-full border-4 border-[#7A1D1B]/20 border-t-[#7A1D1B]" />
            <h1 className="text-2xl font-black text-neutral-900">
              Confirming your payment
            </h1>
            <p className="mt-3 text-sm text-neutral-600">
              Do not close this page or start another payment.
            </p>
          </>
        )}

        {booking && (
          <>
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-2xl text-green-700">
              ✓
            </div>
            <h1 className="text-2xl font-black text-neutral-900">
              Booking confirmed
            </h1>
            <p className="mt-3 text-neutral-600">
              Ticket <strong>{booking.ticketId}</strong> has been issued for{" "}
              {booking.seats.join(", ")}.
            </p>
            <Link
              href="/bookings"
              className="mt-7 inline-flex rounded-xl bg-[#7A1D1B] px-6 py-3 font-bold text-white"
            >
              View my booking
            </Link>
          </>
        )}

        {error && (
          <>
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 text-2xl text-amber-800">
              !
            </div>
            <h1 className="text-2xl font-black text-neutral-900">
              {esewaResultHeading(errorCode)}
            </h1>
            <p className="mt-3 text-sm leading-6 text-neutral-600">{error}</p>
            <p className="mt-3 text-xs text-neutral-500">
              Reference: {attempt}
            </p>
            <p className="mt-3 text-sm text-neutral-600">
              Check your bookings or contact support with this reference before paying again.
            </p>
            <Link
              href="/"
              className="mt-7 inline-flex rounded-xl border border-[#7A1D1B] px-6 py-3 font-bold text-[#7A1D1B]"
            >
              Return home
            </Link>
          </>
        )}
      </section>
    </main>
  );
}
