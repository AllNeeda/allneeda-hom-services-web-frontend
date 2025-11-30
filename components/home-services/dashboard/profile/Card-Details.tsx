"use client";

import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";
import { X, CreditCard } from "lucide-react";
import React, { Dispatch, SetStateAction, useState, useEffect, useRef } from "react";

interface CardDetailsProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  /* eslint-disable no-unused-vars */
  onSave?: (card: CardData) => void;
  /* elslint-enable no-unused-vars */
  initialData?: CardData | null;
}

export interface CardData {
  cardNumber: string;
  cardHolder: string;
  expiry: string;
  cvv: string;
  cardType?: string;
}

// Card type detection
const detectCardType = (cardNumber: string): string => {
  const cleaned = cardNumber.replace(/\s+/g, "");
  if (/^4/.test(cleaned)) return "VISA";
  if (/^5[1-5]/.test(cleaned)) return "MASTERCARD";
  if (/^3[47]/.test(cleaned)) return "AMEX";
  if (/^6(?:011|5)/.test(cleaned)) return "DISCOVER";
  return "VISA"; // Default to VISA
};

// Card icon component
const CardIcon = ({ type }: { type: string }) => {
  const iconClass = "w-6 h-6";
  return (
    <div className="flex items-center justify-center bg-white rounded-sm p-1 shadow-sm">
      <CreditCard className={iconClass} />
    </div>
  );
};

export default function CardDetails({ open, setOpen, onSave, initialData }: CardDetailsProps) {
  const [card, setCard] = useState<CardData>(
    initialData || { cardNumber: "", cardHolder: "", expiry: "", cvv: "", cardType: "VISA" }
  );
  const [showBack, setShowBack] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const cvvRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialData) {
      setCard(initialData);
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCard((prev) => ({ ...prev, [name]: value }));

    if (name === "cardNumber") {
      const cardType = detectCardType(value);
      setCard((prev) => ({ ...prev, cardType }));
    }
  };

  const handleSave = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      if (onSave) onSave(card);
      console.log("Saved card:", card);
      setIsSubmitting(false);
      setOpen(false);
    }, 500);
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{1,16}/g);
    const match = matches ? matches[0] : "";
    const parts = [];
    for (let i = 0; i < match.length; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(" ") : value;
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\D/g, "").slice(0, 4);
    if (v.length >= 3) return `${v.slice(0, 2)}/${v.slice(2)}`;
    return v;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    setCard({ ...card, cardNumber: formatted });
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiry(e.target.value);
    setCard({ ...card, expiry: formatted });
  };

  const handleCvvFocus = () => setShowBack(true);
  const handleCvvBlur = () => setShowBack(false);

  const maskedCardNumber = (cardNumber: string) => {
    if (cardNumber.length <= 4) return cardNumber;
    return "•••• •••• •••• " + cardNumber.slice(-4);
  };

  const maskedCvv = (cvv: string) => "•".repeat(cvv.length);

  return (
    <Dialog open={open} onClose={setOpen} className="relative z-50">
      <DialogBackdrop className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="relative w-full max-w-md transform overflow-hidden rounded-sm bg-white dark:bg-gray-900 text-left shadow-2xl transition-all duration-300">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 px-5 py-3">
            <DialogTitle className="font-semibold text-gray-900 dark:text-white" style={{ fontSize: "13px" }}>
              CARD DETAILS
            </DialogTitle>
            <button
              onClick={() => setOpen(false)}
              className="rounded-full p-1 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              style={{ fontSize: "13px" }}
            >
              <X className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          {/* Body */}
          <div className="px-5 py-4 space-y-5">
            {/* Card Preview */}
            <div className={`relative w-full h-44 rounded-sm text-white shadow-lg transition-transform duration-500 perspective`}>
              <div
                className={`absolute inset-0 w-full h-full rounded-sm bg-gradient-to-br from-gray-900 to-gray-700 p-4 transform transition-transform duration-500 ${
                  showBack ? "rotate-y-180" : ""
                }`}
                style={{ transformStyle: "preserve-3d" }}
              >
                {/* Front */}
                <div className={`absolute inset-0 backface-hidden flex flex-col justify-between p-4`}>
                  <div className="flex justify-between items-start">
                    <div className="w-10 h-7 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-sm"></div>
                    <CardIcon type={card.cardType || "VISA"} />
                  </div>
                  <div>
                    <div className="text-gray-300 mb-1" style={{ fontSize: "13px" }}>CARD NUMBER</div>
                    <div className="font-medium tracking-widest" style={{ fontSize: "13px", letterSpacing: "1px" }}>
                      {card.cardNumber ? maskedCardNumber(card.cardNumber) : "•••• •••• •••• ••••"}
                    </div>
                  </div>
                  <div className="flex justify-between items-end">
                    <div>
                      <div className="text-gray-300 mb-1" style={{ fontSize: "13px" }}>CARD HOLDER</div>
                      <div className="uppercase font-medium" style={{ fontSize: "13px" }}>
                        {card.cardHolder || "YOUR NAME"}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-300 mb-1" style={{ fontSize: "13px" }}>EXPIRES</div>
                      <div style={{ fontSize: "13px" }}>{card.expiry || "MM/YY"}</div>
                    </div>
                  </div>
                </div>

                {/* Back */}
                <div className="absolute inset-0 backface-hidden rotate-y-180 bg-gradient-to-br from-gray-800 to-gray-600 text-white rounded-sm p-4 flex flex-col justify-between">
                  <div className="bg-black h-8 w-full mt-3"></div>
                  <div className="bg-gray-700 h-8 rounded flex items-center px-3">
                    <span className="text-gray-300 mr-2" style={{ fontSize: "13px" }}>CVV</span>
                    <span className="bg-white text-black px-2 py-1 rounded text-sm tracking-widest">
                      {card.cvv ? maskedCvv(card.cvv) : "•••"}
                    </span>
                  </div>
                  <div className="flex justify-end">
                    <CardIcon type={card.cardType || "VISA"} />
                  </div>
                </div>
              </div>
            </div>

            {/* Form Inputs */}
            <div className="grid gap-3">
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-1" style={{ fontSize: "13px" }}>
                  Card Number
                </label>
                <input
                  type="text"
                  name="cardNumber"
                  value={card.cardNumber}
                  onChange={handleCardNumberChange}
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                  className="w-full rounded border border-gray-300 px-3 py-2 dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-[#0077B6] focus:border-transparent outline-none transition-all"
                  style={{ fontSize: "13px" }}
                />
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-1" style={{ fontSize: "13px" }}>
                  Card Holder
                </label>
                <input
                  type="text"
                  name="cardHolder"
                  value={card.cardHolder}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full rounded border border-gray-300 px-3 py-2 dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-[#0077B6] focus:border-transparent outline-none transition-all"
                  style={{ fontSize: "13px" }}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-1" style={{ fontSize: "13px" }}>
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    name="expiry"
                    value={card.expiry}
                    onChange={handleExpiryChange}
                    placeholder="MM/YY"
                    maxLength={5}
                    className="w-full rounded border border-gray-300 px-3 py-2 dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-[#0077B6] focus:border-transparent outline-none transition-all"
                    style={{ fontSize: "13px" }}
                  />
                </div>
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-1" style={{ fontSize: "13px" }}>
                    CVV
                  </label>
                  <input
                    ref={cvvRef}
                    type="text"
                    name="cvv"
                    value={card.cvv}
                    onChange={handleChange}
                    onFocus={handleCvvFocus}
                    onBlur={handleCvvBlur}
                    placeholder="123"
                    maxLength={3}
                    className="w-full rounded border border-gray-300 px-3 py-2 dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-[#0077B6] focus:border-transparent outline-none transition-all"
                    style={{ fontSize: "13px" }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-2 border-t border-gray-200 dark:border-gray-800 px-5 py-3">
            <button
              onClick={() => setOpen(false)}
              className="rounded border border-gray-300 bg-white px-3 py-2 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
              style={{ fontSize: "13px" }}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSubmitting}
              className="rounded bg-[#0077B6] px-3 py-2 text-white hover:bg-[#0077B6] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
              style={{ fontSize: "13px" }}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Saving...
                </>
              ) : (
                "Save Card"
              )}
            </button>
          </div>
        </DialogPanel>
      </div>

      <style jsx>{`
        .perspective {
          perspective: 1000px;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
      `}</style>
    </Dialog>
  );
}
