export function getExpiryTime(expiry?: string | Date | null): number | null {
  if (!expiry) {
    return null;
  }

  const expiryTime = new Date(expiry).getTime();

  return Number.isFinite(expiryTime) ? expiryTime : null;
}

export interface ExpirableCoupon {
  isCurrentlyValid?: boolean;
  validTo?: string | Date | null;
  expiryDate?: string | Date | null;
}

export function isOfferExpired(coupon: ExpirableCoupon, currentTime: number): boolean {
  if (coupon.isCurrentlyValid === false) {
    return true;
  }

  const expiry = coupon.validTo || coupon.expiryDate;
  const expiryTime = getExpiryTime(expiry);

  if (expiryTime === null) {
    return false;
  }

  return expiryTime < currentTime;
}

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

export function shouldDisplayOffer(coupon: ExpirableCoupon, currentTime: number): boolean {
  const expiry = coupon.validTo || coupon.expiryDate;
  const expiryTime = getExpiryTime(expiry);

  if (expiryTime === null) {
    return true;
  }

  if (expiryTime >= currentTime) {
    return true;
  }

  return currentTime - expiryTime <= THIRTY_DAYS_MS;
}
