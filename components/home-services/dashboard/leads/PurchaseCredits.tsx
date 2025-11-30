import { useState } from "react";
import { X } from "lucide-react";

type PaymentModalProps = {
  credits: number;
  pricePerCredit: number;
  creditsUsed: number;
  onClose: () => void;
};

export default function PaymentModal({ credits, pricePerCredit, creditsUsed, onClose }: PaymentModalProps) {
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");

  const totalPrice = (credits * pricePerCredit).toFixed(2);

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 px-4">
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-gray-900 rounded-lg shadow-lg max-w-md w-full p-6 text-gray-900 dark:text-gray-100 text-[13px] font-sans"
      >
        {/* Close Button */}
        <span
          onClick={onClose}
          aria-label="Close payment modal"
          className="absolute top-4 right-4 cursor-pointer text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0077B6] rounded"
        >
          <X className="h-5 w-5" />
        </span>

        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-[17px] font-semibold text-gray-900 dark:text-gray-100">
            You are <span className="font-bold text-[#0077B6]">buying</span> {credits} credits
          </h2>
          <p className="mt-1 text-gray-600 dark:text-gray-400 text-[13px]">
            £{pricePerCredit.toFixed(2)} each, £{totalPrice} total (ex VAT)
          </p>
          <p className="mt-1 text-gray-600 dark:text-gray-400 text-[12px]">
            {creditsUsed} credits will be used to contact Helen
          </p>
        </div>

        {/* Payment Buttons */}
        <div className="flex gap-3 mb-6">
          <button
            type="button"
            className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 rounded shadow transition-colors"
          >
            Pay with <span className="italic font-bold">PayPal</span>
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center text-gray-400 text-[12px] mb-4">
          <hr className="flex-grow border-gray-300" />
          <span className="px-3">or pay with card</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        {/* Card Form */}
        <form>
          <label htmlFor="card-number" className="block mb-1 font-semibold text-gray-700 dark:text-gray-300 text-[12px]">
            Card number
          </label>
          <input
            id="card-number"
            type="text"
            inputMode="numeric"
            placeholder="•••• •••• •••• ••••"
            className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 mb-4 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#0077B6]"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
          />

          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <label htmlFor="expiry" className="block mb-1 font-semibold text-gray-700 dark:text-gray-300 text-[12px]">
                Expiry date
              </label>
              <input
                id="expiry"
                type="text"
                placeholder="MM / YY"
                maxLength={5}
                className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#0077B6]"
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
              />
            </div>

            <div className="flex-1">
              <label htmlFor="cvc" className="block mb-1 font-semibold text-gray-700 dark:text-gray-300 text-[12px]">
                CVC
              </label>
              <input
                id="cvc"
                type="text"
                placeholder="CVC"
                maxLength={4}
                className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#0077B6]"
                value={cvc}
                onChange={(e) => setCvc(e.target.value)}
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={onClose}
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 text-[13px]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!cardNumber || !expiry || !cvc}
              className={`bg-[#0077B6] text-white font-semibold py-2 px-6 rounded shadow transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#005f8e]`}
            >
              Pay with card
            </button>
          </div>
        </form>

        {/* Footer */}
        <div className="mt-6 text-gray-500 dark:text-gray-400 text-[11px] flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="#6B7280"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 11c0-3 3-4 3-4m-6 0a3 3 0 016 0v1a1 1 0 01-1 1H8v1"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 12v2a2 2 0 01-2 2H5a2 2 0 01-2-2v-2"
            />
          </svg>
          <span>
            <strong>Your payment is secure</strong> Your card will be securely stored for future purchases. You can update it
            in settings at any time.
          </span>
        </div>
      </div>
    </div>
  );
}
