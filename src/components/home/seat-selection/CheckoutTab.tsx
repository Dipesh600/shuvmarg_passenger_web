import React from 'react';

interface CheckoutTabProps {
  selectedMethod: string;
  setSelectedMethod: (val: string) => void;
  selectedSeats: any[];
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
      <div className="max-w-6xl mx-auto w-full p-8 flex flex-col min-h-0">
        <div className="flex-1 overflow-y-auto pr-4 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pb-20">
          
          {/* Left Column - Payment Methods */}
          <div className="lg:col-span-7 space-y-6">
            <h2 className="text-[20px] font-black text-neutral-900 mb-2">Select Payment Method</h2>
            
            <div className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-[#D8C5A8] overflow-hidden">
              {/* ConnectIPS */}
              <label className={`flex items-center gap-4 p-5 border-b border-[#E2D6C6] cursor-pointer transition-colors ${selectedMethod === 'connectips' ? 'bg-[#F8F1E3]' : 'hover:bg-neutral-50'}`}>
                <input type="radio" name="paymentMethod" value="connectips" checked={selectedMethod === 'connectips'} onChange={(e) => setSelectedMethod(e.target.value)} className="w-5 h-5 text-[#7A1D1B] focus:ring-[#7A1D1B]" />
                <div className="w-16 h-12 bg-white rounded border border-neutral-200 p-2 flex items-center justify-center shrink-0 shadow-sm">
                  <img src="/payment/connectips.png" alt="ConnectIPS" className="w-full h-full object-contain" />
                </div>
                <div className="flex-1">
                  <h3 className="text-[15px] font-semibold text-neutral-900">ConnectIPS</h3>
                  <p className="text-[12px] text-[#2E7D32] font-medium mt-0.5">Recommended • Lowest fee</p>
                </div>
              </label>

              {/* eSewa */}
              <label className={`flex items-center gap-4 p-5 border-b border-[#E2D6C6] cursor-pointer transition-colors ${selectedMethod === 'esewa' ? 'bg-[#F8F1E3]' : 'hover:bg-neutral-50'}`}>
                <input type="radio" name="paymentMethod" value="esewa" checked={selectedMethod === 'esewa'} onChange={(e) => setSelectedMethod(e.target.value)} className="w-5 h-5 text-[#7A1D1B] focus:ring-[#7A1D1B]" />
                <div className="w-16 h-12 bg-white rounded border border-neutral-200 p-2 flex items-center justify-center shrink-0 shadow-sm">
                  <img src="/payment/esewa.png" alt="eSewa" className="w-full h-full object-contain" />
                </div>
                <h3 className="text-[15px] font-semibold text-neutral-900">eSewa</h3>
              </label>

              {/* Khalti */}
              <label className={`flex items-center gap-4 p-5 border-b border-[#E2D6C6] cursor-pointer transition-colors ${selectedMethod === 'khalti' ? 'bg-[#F8F1E3]' : 'hover:bg-neutral-50'}`}>
                <input type="radio" name="paymentMethod" value="khalti" checked={selectedMethod === 'khalti'} onChange={(e) => setSelectedMethod(e.target.value)} className="w-5 h-5 text-[#7A1D1B] focus:ring-[#7A1D1B]" />
                <div className="w-16 h-12 bg-white rounded border border-neutral-200 p-2 flex items-center justify-center shrink-0 shadow-sm">
                  <img src="/payment/khalti.png" alt="Khalti" className="w-full h-full object-contain" />
                </div>
                <h3 className="text-[15px] font-semibold text-neutral-900">Khalti</h3>
              </label>

              {/* Fonepay */}
              <label className={`flex items-center gap-4 p-5 cursor-pointer transition-colors ${selectedMethod === 'fonepay' ? 'bg-[#F8F1E3]' : 'hover:bg-neutral-50'}`}>
                <input type="radio" name="paymentMethod" value="fonepay" checked={selectedMethod === 'fonepay'} onChange={(e) => setSelectedMethod(e.target.value)} className="w-5 h-5 text-[#7A1D1B] focus:ring-[#7A1D1B]" />
                <div className="w-16 h-12 bg-white rounded border border-neutral-200 p-2 flex items-center justify-center shrink-0 shadow-sm">
                  <img src="/payment/fonepay.png" alt="Fonepay" className="w-full h-full object-contain" />
                </div>
                <h3 className="text-[15px] font-semibold text-neutral-900">Fonepay Direct</h3>
              </label>
            </div>

            <p className="text-[13px] text-neutral-600 font-medium pt-2">The e-ticket will be automatically sent to you by SMS and email, once the payment is confirmed.</p>
          </div>

          {/* Right Column - Summaries */}
          <div className="lg:col-span-5 space-y-6">
            {/* Offers Section */}
            <div className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-[#D8C5A8] p-5 flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-[#16a34a]/10 flex items-center justify-center text-[#16a34a] flex-shrink-0">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>
              </div>
              <div>
                <h3 className="text-[15px] font-bold text-neutral-900">You have eligible offers</h3>
                <p className="text-[12px] text-neutral-500 mt-0.5">Exclusive discounts have been applied to your total.</p>
              </div>
            </div>

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
                
                <div className="flex justify-between text-[14px] text-[#16a34a]">
                  <span className="font-medium">Discount</span>
                  <span className="font-bold">- Rs. {Math.round(totalPrice * 0.10)}</span>
                </div>

                <div className="pt-4 border-t border-neutral-200 flex justify-between items-end">
                  <span className="text-[18px] font-black text-neutral-900">Total Amount</span>
                  <span className="text-[24px] font-black text-[#7A1D1B]">Rs. {finalPrice - Math.round(totalPrice * 0.10)}</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
