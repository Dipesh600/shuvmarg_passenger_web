import { useState, useEffect, useCallback } from "react";
import { SeatConfig } from "@/components/home/PassengerSeatMap";

export interface TripSeatsData {
  seatConfig: SeatConfig;
  bookedSeatIds: string[];
}

// Generate a dummy seat layout based on the ShuvMarg requirements
function generateMockSeatConfig(): SeatConfig {
  const rows = [];
  for (let i = 0; i < 9; i++) {
    rows.push({
      cells: [
        { cellType: "SEAT", seatType: "STANDARD", seatLabel: `A${i+1}`, seatId: `A${i+1}` },
        { cellType: "SEAT", seatType: "STANDARD", seatLabel: `B${i+1}`, seatId: `B${i+1}` },
        { cellType: "AISLE", seatType: "STANDARD", seatLabel: null, seatId: null },
        { cellType: "SEAT", seatType: "STANDARD", seatLabel: `C${i+1}`, seatId: `C${i+1}` },
        { cellType: "SEAT", seatType: "STANDARD", seatLabel: `D${i+1}`, seatId: `D${i+1}` },
      ],
    });
  }
  
  // Last row has 5 seats across
  rows.push({
    cells: [
      { cellType: "SEAT", seatType: "STANDARD", seatLabel: `A10`, seatId: `A10` },
      { cellType: "SEAT", seatType: "STANDARD", seatLabel: `B10`, seatId: `B10` },
      { cellType: "SEAT", seatType: "STANDARD", seatLabel: `C10`, seatId: `C10` },
      { cellType: "SEAT", seatType: "STANDARD", seatLabel: `D10`, seatId: `D10` },
      { cellType: "SEAT", seatType: "STANDARD", seatLabel: `E10`, seatId: `E10` },
    ],
  });

  return {
    busShape: "2X2",
    floors: [{ floorLevel: 1, floorName: "Lower Deck", rows: rows as any }],
  };
}

const mockSeatConfig = generateMockSeatConfig();
const mockBookedSeatIds = ["B2", "C3", "A7", "D8", "B10"];

export function useTripSeats(tripId: string) {
  const [data, setData] = useState<TripSeatsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSeats = useCallback(() => {
    if (!tripId) return;
    
    setIsLoading(true);
    setError(null);
    
    // Simulate network delay
    setTimeout(() => {
      setData({
        seatConfig: mockSeatConfig,
        bookedSeatIds: mockBookedSeatIds,
      });
      setIsLoading(false);
    }, 800);
  }, [tripId]);

  useEffect(() => {
    loadSeats();
  }, [loadSeats]);

  return {
    seatConfig: data?.seatConfig as SeatConfig | undefined,
    bookedSeatIds: data?.bookedSeatIds || [],
    isLoading,
    error,
    refetch: loadSeats,
  };
}
