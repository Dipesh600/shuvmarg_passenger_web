export interface EdgeConfig {
  top?: "smooth" | "ticket" | "torn";
  bottom?: "smooth" | "ticket" | "torn";
  left?: "smooth" | "ticket" | "torn";
  right?: "smooth" | "ticket" | "torn";
}

export interface ImageConfig {
  fit?: "cover" | "contain" | "fill";
  scale?: number;
  offsetX?: number;
  offsetY?: number;
}

export interface TypographyConfig {
  titleAlignment?: "left" | "center" | "right";
  descAlignment?: "left" | "center" | "right";
  codeAlignment?: "left" | "center" | "right";
}

export interface CouponDesignConfig {
  edges?: EdgeConfig;
  imageConfig?: ImageConfig;
  typography?: TypographyConfig;
}

export interface CouponItem {
  _id: string;
  title: string;
  couponCode: string;
  description: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  minOrderAmount?: number;
  maxDiscountAmount?: number;
  category?: "General Offer" | "Exclusive" | "Operator Offer" | "Wallet Offer" | string;
  busOperatorName?: string;
  isCurrentlyValid?: boolean;
  startDate?: string;
  expiryDate?: string;
  validFrom?: string;
  validTo?: string;
  perUserLimit?: number;
  totalUsageLimit?: number;
  applicableRoutes?: string[];
  designConfig?: CouponDesignConfig;
  imageUrl?: string;
}
