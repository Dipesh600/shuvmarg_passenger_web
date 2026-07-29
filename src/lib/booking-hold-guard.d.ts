export interface BookingHoldGuard {
  begin(): number;
  invalidate(): void;
  complete(operation: number): void;
  isCurrent(operation: number): boolean;
  isPreparing(): boolean;
}

export function createBookingHoldGuard(): BookingHoldGuard;
