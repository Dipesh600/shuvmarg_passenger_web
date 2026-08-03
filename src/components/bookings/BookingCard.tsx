"use client";

import React from "react";
import {
  Ticket,
  Clock,
  Calendar,
  ChevronRight,
  Download,
  CheckCircle2,
  XCircle,
  Bus,
  QrCode,
} from "lucide-react";
import { useToast } from "@/context/ToastContext";
import type { HistoryBookingItem, BookingTab } from "./BookingsTabList";

interface BookingCardProps {
  item: HistoryBookingItem;
  activeTab: BookingTab;
}

export default function BookingCard({ item, activeTab }: BookingCardProps) {
  const { showToast } = useToast();
  const b = item.booking;
  const t = item.trip;
  const bus = t?.busId;
  const route = t?.routeDetail;

  const ticketNumber = b.ticketId || b.bookingId.slice(-8).toUpperCase();
  const fromCity = route?.from || "Origin";
  const toCity = route?.to || "Destination";
  const busTitle = bus?.busName || "Standard Express";
  const busType = bus?.busType || "AC Deluxe";

  const formattedDepDate = t?.departureTime
    ? new Date(t.departureTime).toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Date Pending";

  const formattedDepTime = t?.departureTime
    ? new Date(t.departureTime).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Time Pending";

  return (
    <div className="bg-white rounded-2xl p-6 border border-[#EDE5D8] shadow-sm hover:shadow-md transition-shadow relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
      {/* Ticket Info */}
      <div className="flex-1 space-y-4">
        {/* Top row: Ticket ID & Status */}
        <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
              Ticket ID:
            </span>
            <span className="font-mono font-bold text-[#D94328] text-sm bg-[#FAF7F2] px-2.5 py-0.5 rounded border border-[#EDE5D8]">
              {ticketNumber}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {activeTab === "Cancelled" ? (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-200">
                <XCircle className="w-3.5 h-3.5" />
                Cancelled
              </span>
            ) : activeTab === "Completed" ? (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Completed
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                <Ticket className="w-3.5 h-3.5" />
                Confirmed
              </span>
            )}
          </div>
        </div>

        {/* Route & Bus details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center gap-2 text-base font-bold text-[#111111]">
              <span>{fromCity}</span>
              <ChevronRight className="w-4 h-4 text-[#D94328]" />
              <span>{toCity}</span>
            </div>
            <div className="text-xs text-neutral-500 font-medium flex items-center gap-1.5 mt-1">
              <Bus className="w-3.5 h-3.5 text-neutral-400" />
              <span>{busTitle} ({busType})</span>
            </div>
          </div>

          <div className="sm:text-right">
            <div className="text-sm font-bold text-[#111111] flex items-center sm:justify-end gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#D94328]" />
              <span>{formattedDepDate}</span>
            </div>
            <div className="text-xs text-neutral-500 font-medium flex items-center sm:justify-end gap-1.5 mt-1">
              <Clock className="w-3.5 h-3.5 text-neutral-400" />
              <span>Departure: {formattedDepTime}</span>
            </div>
          </div>
        </div>

        {/* Seats & Price */}
        <div className="flex items-center justify-between text-xs font-medium text-neutral-600 pt-2 border-t border-dashed border-neutral-100">
          <div>
            Seats: <strong className="text-neutral-900 font-bold">{b.seats?.join(", ") || "Selected"}</strong>
          </div>
          <div>
            Total Amount: <strong className="text-[#D94328] font-bold text-sm">NPR {b.totalAmount?.toLocaleString() || "0"}</strong>
          </div>
        </div>
      </div>

      {/* Ticket Actions */}
      <div className="flex md:flex-col items-center justify-end gap-2 shrink-0 border-t md:border-t-0 md:border-l border-neutral-100 pt-4 md:pt-0 md:pl-6">
        <button
          onClick={() => showToast(`Ticket ${ticketNumber} ready for download`, "success")}
          className="flex-1 md:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-[#D94328] hover:bg-[#C93522] text-white text-xs font-bold rounded-xl transition-all shadow-sm"
        >
          <Download className="w-3.5 h-3.5" />
          Ticket PDF
        </button>
        <button
          onClick={() => showToast(`Boarding Pass QR for ${ticketNumber}`, "info")}
          className="flex-1 md:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-white hover:bg-neutral-100 text-[#0B3150] text-xs font-bold rounded-xl border border-neutral-300 transition-colors"
        >
          <QrCode className="w-3.5 h-3.5" />
          View QR
        </button>
      </div>

    </div>
  );
}
