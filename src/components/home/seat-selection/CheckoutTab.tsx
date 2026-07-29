import React from 'react';

interface CheckoutTabProps {
  selectedMethod: string;
  setSelectedMethod: (val: string) => void;
  selectedSeats: Array<{ id: string; label: string; price: number }>;
  totalPrice: number;
  paymentFee: number;
  finalPrice: number;
}

export default function CheckoutTab({
  selectedMethod,
  setSelectedMethod,
  selectedSeats,
  totalPrice,
  paymentFee,
  finalPrice
}: CheckoutTabProps) {
  return (
    <div className="w-full flex h-full min-h-0 bg-transparent">
      <div className="w-full px-4 md:px-6 py-4 md:py-6 flex flex-col min-h-0">
        <div className="flex-1 overflow-y-auto pr-4 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pb-20">
          
          {/* Left Column - Payment Methods */}
          <div className="lg:col-span-7 space-y-6">
            <h2 className="text-[20px] font-black text-neutral-900 mb-2">Select Payment Method</h2>
            
            <div className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-[#D8C5A8] overflow-hidden">
              {/* ConnectIPS */}
              <label className="flex items-center gap-4 p-5 border-b border-[#E2D6C6] opacity-50">
                <input disabled type="radio" name="paymentMethod" value="connectips" className="w-5 h-5" />
                <div className="w-16 h-12 bg-white rounded border border-neutral-200 p-2 flex items-center justify-center shrink-0 shadow-sm">
                  <img src="/payment/connectips.png" alt="ConnectIPS" className="w-full h-full object-contain" />
                </div>
                <div className="flex-1">
                  <h3 className="text-[15px] font-semibold text-neutral-900">ConnectIPS</h3>
                  <p className="text-[12px] text-neutral-500 font-medium mt-0.5">Coming soon</p>
                </div>
              </label>

              {/* eSewa */}
              <label className={`flex items-center gap-4 p-5 border-b border-[#E2D6C6] cursor-pointer transition-colors ${selectedMethod === 'esewa' ? 'bg-[#F8F1E3]' : 'hover:bg-neutral-50'}`}>
                <input type="radio" name="paymentMethod" value="esewa" checked={selectedMethod === 'esewa'} onChange={(e) => setSelectedMethod(e.target.value)} className="w-5 h-5 text-[#D94328] focus:ring-[#D94328]" />
                <div className="w-16 h-12 bg-white rounded border border-neutral-200 p-2 flex items-center justify-center shrink-0 shadow-sm">
                  <img src="/payment/esewa.png" alt="eSewa" className="w-full h-full object-contain" />
                </div>
                <h3 className="text-[15px] font-semibold text-neutral-900">eSewa</h3>
              </label>

              {/* Khalti */}
              <label className="flex items-center gap-4 p-5 border-b border-[#E2D6C6] opacity-50">
                <input disabled type="radio" name="paymentMethod" value="khalti" className="w-5 h-5" />
                <div className="w-16 h-12 bg-white rounded border border-neutral-200 p-2 flex items-center justify-center shrink-0 shadow-sm">
                  <img src="/payment/khalti.png" alt="Khalti" className="w-full h-full object-contain" />
                </div>
                <h3 className="text-[15px] font-semibold text-neutral-900">Khalti · Coming soon</h3>
              </label>

              {/* Fonepay */}
              <label className="flex items-center gap-4 p-5 opacity-50">
                <input disabled type="radio" name="paymentMethod" value="fonepay" className="w-5 h-5" />
                <div className="w-16 h-12 bg-white rounded border border-neutral-200 p-2 flex items-center justify-center shrink-0 shadow-sm">
                  <img src="/payment/fonepay.png" alt="Fonepay" className="w-full h-full object-contain" />
                </div>
                <h3 className="text-[15px] font-semibold text-neutral-900">Fonepay Direct · Coming soon</h3>
              </label>
            </div>

            <p className="text-[13px] text-neutral-600 font-medium pt-2">
              Your confirmed ticket will be available in your Shuvmarg account after payment.
            </p>
          </div>

          {/* Right Column - Summaries */}
          <div className="lg:col-span-5 space-y-6 mt-4 lg:mt-12">
            {/* Fare Breakup */}
            <div className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-[#D8C5A8] overflow-hidden">
              <div className="p-6 space-y-4">
                <h3 className="text-[16px] font-bold text-neutral-900 mb-2">Fare breakup</h3>
                
                <div className="flex justify-between text-[14px]">
                  <span className="text-neutral-600">Base Fare ({selectedSeats.length} Seats)</span>
                  <span className="font-bold text-neutral-900">Rs. {totalPrice}</span>
                </div>
                
                <div className="flex justify-between text-[14px]">
                  <span className="text-neutral-600">Convenience Fee</span>
                  <span className="font-bold text-neutral-900">Rs. {paymentFee}</span>
                </div>

                <div className="pt-4 border-t border-neutral-200 flex justify-between items-end">
                  <span className="text-[18px] font-black text-neutral-900">Total Amount</span>
                  <span className="text-[24px] font-black text-[#D94328]">Rs. {finalPrice}</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
