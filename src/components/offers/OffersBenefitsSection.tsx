"use client";

import React from "react";
import Image from "next/image";

export default function OffersBenefitsSection() {
  return (
    <>
      {/* Benefits Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 mb-16 text-center">
        <div className="flex flex-col items-center">
          <div className="h-[180px] flex items-center justify-center mb-6">
            <Image
              src="/images/offers/more saving.webp"
              width={180}
              height={180}
              alt="More Savings"
              className="drop-shadow-sm object-contain max-h-full"
            />
          </div>
          <h3 className="text-[#015db8] font-bold text-lg mb-3">More Savings</h3>
          <p className="text-gray-600 text-sm leading-relaxed px-4">
            Book bus tickets at the lowest ticket fare on ShuvMarg and avail discounts, coupon codes, offers on bus ticket booking, cashback and more savings on ticket booking online.
          </p>
        </div>

        <div className="flex flex-col items-center">
          <div className="h-[180px] flex items-center justify-center mb-6">
            <Image
              src="/images/offers/secure.webp"
              width={180}
              height={180}
              alt="Secure Payments"
              className="drop-shadow-sm object-contain max-h-full"
            />
          </div>
          <h3 className="text-[#015db8] font-bold text-lg mb-3">100% Secure Payments</h3>
          <p className="text-gray-600 text-sm leading-relaxed px-4">
            Customer security is important to ShuvMarg. We have ensured that customers&apos; personal information is safeguarded at all times with industry standard data encryption.
          </p>
        </div>

        <div className="flex flex-col items-center">
          <div className="h-[180px] flex items-center justify-center mb-6">
            <Image
              src="/images/offers/surprise.webp"
              width={180}
              height={180}
              alt="Surprise Gifts"
              className="drop-shadow-sm object-contain max-h-full"
            />
          </div>
          <h3 className="text-[#015db8] font-bold text-lg mb-3">Surprise Gifts</h3>
          <p className="text-gray-600 text-sm leading-relaxed px-4">
            ShuvMarg offers plenty of occasions to give surprise gifts to the customers when they book bus tickets. Book your ticket now and avail a special gift today!
          </p>
        </div>
      </div>

      {/* App Install Section */}
      <div className="text-center mb-16">
        <h2 className="text-[#ff7828] text-xl font-bold mb-3">
          Install ShuvMarg App to Book Your Seat Just With A Tap
        </h2>
        <p className="text-gray-600 text-sm">
          Book buses on the go with the ShuvMarg App. Download ShuvMarg app and get the best ticket booking offers online to save money!
        </p>
      </div>
    </>
  );
}
