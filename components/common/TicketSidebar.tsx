"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

type TicketOption = {
  label: string
  original: string
  price: string
  discount: string
  promo: string
  promoCode: string
}

interface TicketSidebarProps {
  ticketOptions: TicketOption[]
}

export default function TicketSidebar({ ticketOptions }: TicketSidebarProps) {
  const [buyAsGift, setBuyAsGift] = useState(false)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)

  return (
      <div className="rounded-2xl shadow-xl dark:bg-gray-900 p-6 sticky top-40">
        {/* Promo Code Banner */}
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 flex items-center justify-between mb-4">
          <div>
            <span className="font-semibold text-purple-700">Extra $5.51 off</span>
            <span className="ml-2 text-xs text-gray-500">
              Promo <span className="font-semibold">SUMMERFUN</span> ends in:{" "}
              <span className="font-mono">1 day 11:28:27</span>
            </span>
          </div>
          <Badge variant="outline" className="text-purple-700 border-purple-300">
            SUMMERFUN
          </Badge>
        </div>

        {/* Select Option */}
        <div className="flex items-center justify-between mb-2">
          <span className="font-semibold text-base">Select Option:</span>
          <label className="flex items-center gap-2 text-xs cursor-pointer select-none">
            <input
              type="checkbox"
              checked={buyAsGift}
              onChange={(e) => setBuyAsGift(e.target.checked)}
              className="accent-[#0077B6]"
            />
            Buy as a gift
          </label>
        </div>

        <div className="flex flex-col gap-3 mb-4">
          {ticketOptions.map((opt, idx) => (
            <div
              key={idx}
              className={`flex flex-col gap-2 border-2 rounded-xl p-4 cursor-pointer transition-all ${
                selectedOption === idx
                  ? "border-[#0077B6] bg-blue-50/30"
                  : "border-gray-200 hover:border-[#0077B6]/40"
              }`}
              onClick={() => setSelectedOption(idx)}
            >
              <div className="flex items-center gap-2 mb-1">
                <input
                  type="radio"
                  checked={selectedOption === idx}
                  onChange={() => setSelectedOption(idx)}
                  className="accent-[#0077B6] w-4 h-4"
                />
                <span className="font-medium text-sm">{opt.label}</span>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="line-through text-gray-400">{opt.original}</span>
                <span className="font-bold text-green-700 text-lg">{opt.price}</span>
                <Badge variant="outline" className="text-green-600 border-green-300">
                  {opt.discount}
                </Badge>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-purple-700 font-semibold text-sm">
                  {opt.promo} <span className="text-xs">with code {opt.promoCode}</span>
                </span>
                <Button variant="outline" size="sm">
                  Apply
                </Button>
              </div>
            </div>
          ))}
        </div>

        <Button className="w-full px-8 py-3 text-lg font-bold bg-green-600 hover:bg-green-700">
          Buy now
        </Button>
      </div>
  )
}
