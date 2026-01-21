"use client";

import React, { useMemo, useState } from "react";
import { useGetCreditPackage } from "@/hooks/useCredits";
import { createCheckoutSession } from "@/app/api/services/checkout.api";
import { getAccessToken } from "@/app/api/axios";
import { CreditPackage } from "@/types/credit.types";

type BillingTab = "monthly" | "annual" | "one_time";

export default function CheckoutForm() {
  const token = getAccessToken() || "";

  const { data, isLoading, isError } = useGetCreditPackage(token);
  const packages: CreditPackage[] = data?.data?.data || [];

  const [activeTab, setActiveTab] = useState<BillingTab>("monthly");
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  /* ---------------- Helpers ---------------- */

  const monthlyPackages = useMemo(
    () => packages.filter(p => p.billingType === "monthly"),
    [packages]
  );

  const annualPackages = useMemo(
    () => packages.filter(p => p.billingType === "yearly"),
    [packages]
  );

  const oneTimePackages = useMemo(
    () => packages.filter(p => p.billingType === "one_time"),
    [packages]
  );

  const currentPackages = useMemo(() => {
    if (activeTab === "monthly") return monthlyPackages;
    if (activeTab === "annual") return annualPackages;
    return oneTimePackages;
  }, [activeTab, monthlyPackages, annualPackages, oneTimePackages]);

  const selectedPkg = packages.find(p => p._id === selectedPackage);

  const formatPrice = (amount: number, currency = "USD") =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(amount);

  // const calculateDiscountPercentage = (price: number, discount: number) =>
  //   Math.round(((price - discount) / price) * 100);

  /* ---------------- Actions ---------------- */

  const handleSelectPackage = (id: string) => {
    setSelectedPackage(id);
  };

  const handleCheckout = async () => {
    if (!selectedPackage) return;

    try {
      setLoading(true);
      const res = await createCheckoutSession(selectedPackage, token);
      if (res?.url) window.location.href = res.url;
    } catch (err) {
      console.error("Checkout error:", err);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- States ---------------- */

  if (isLoading) {
    return <p className="text-center py-20">Loading credit packages…</p>;
  }

  if (isError) {
    return (
      <p className="text-center text-red-500 py-20">
        Failed to load packages
      </p>
    );
  }

  /* ---------------- UI ---------------- */

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10 px-4">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-[#0077B6] dark:text-white mb-3">
            Choose Your Plan
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-sm max-w-2xl mx-auto">
            Select the perfect plan for your needs. All plans include our core features.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex bg-gray-100 dark:bg-gray-800 p-1 rounded-sm">
            {(["monthly", "annual", "one_time"] as BillingTab[]).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2 text-sm rounded-sm transition-all
                  ${activeTab === tab
                    ? "bg-white dark:bg-[#026ba3] text-[#0077B6] dark:text-white shadow"
                    : "text-gray-500 dark:text-gray-300 hover:text-[#0077B6]"
                  }`}
              >
                {tab === "monthly" && "Monthly"}
                {tab === "annual" && "Annual"}
                {tab === "one_time" && "One-Time"}
              </button>
            ))}
          </div>
        </div>

        {/* Plans */}
        {currentPackages.length === 0 ? (
          <p className="text-center text-gray-500 py-20">
            No plans available for this billing cycle.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {currentPackages.map((pkg) => {
              
              const isSelected = selectedPackage === pkg._id;
              const hasDiscount =
                pkg.discountPrice && pkg.discountPrice < pkg.price;

              return (
                <div
                  key={pkg._id}
                  onMouseEnter={() => setHoveredCard(pkg._id)}
                  onMouseLeave={() => setHoveredCard(null)}
                  className={`border rounded-sm transition-all
                    ${isSelected
                      ? "border-[#0077B6] ring-2 ring-[#0077B6]/20 shadow-md"
                      : "border-gray-200 dark:border-gray-700"
                    }
                    ${hoveredCard === pkg._id && !isSelected ? "-translate-y-1 shadow-lg" : ""}
                  `}
                >
                  <div className="p-6 bg-white dark:bg-gray-800">

                    <h3 className="text-center font-bold text-[#0077B6] text-lg mb-3">
                      {pkg.name}
                    </h3>

                    <div className="text-center mb-4">
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        {pkg.credits} Credits
                      </span>
                    </div>

                    <div className="text-center mb-5">
                      {hasDiscount ? (
                        <>
                          <div className="text-gray-400 line-through text-sm">
                            {formatPrice(pkg.price, pkg.currency)}
                          </div>
                          <div className="text-3xl font-bold text-[#0077B6]">
                            {formatPrice(pkg.discountPrice!, pkg.currency)}
                          </div>
                        </>
                      ) : (
                        <div className="text-3xl font-bold text-[#0077B6]">
                          {formatPrice(pkg.price, pkg.currency)}
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => handleSelectPackage(pkg._id)}
                      className={`w-full py-3 rounded-sm font-semibold transition-all
                        ${isSelected
                          ? "bg-[#0077B6] text-white"
                          : "bg-gray-100 dark:bg-gray-700 text-[#0077B6] hover:bg-gray-200"
                        }`}
                    >
                      {isSelected ? "Selected" : "Select Plan"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Order Summary */}
        {selectedPkg && (
          <div className="mt-12 max-w-3xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-sm border">
            <h3 className="text-center font-bold text-[#0077B6] mb-6">
              Order Summary
            </h3>

            <div className="flex justify-between mb-3 text-sm">
              <span>Plan</span>
              <span className="font-semibold">{selectedPkg.name}</span>
            </div>

            <div className="flex justify-between mb-3 text-sm">
              <span>Credits</span>
              <span className="font-semibold">{selectedPkg.credits}</span>
            </div>

            <div className="flex justify-between text-lg font-bold border-t pt-4">
              <span>Total</span>
              <span className="text-[#0077B6]">
                {formatPrice(
                  selectedPkg.discountPrice || selectedPkg.price,
                  selectedPkg.currency
                )}
              </span>
            </div>

            <button
              onClick={handleCheckout}
              disabled={loading}
              className="w-full mt-6 py-4 bg-gradient-to-r from-[#0077B6] to-[#00A8E8]
                text-white rounded-sm font-semibold
                hover:from-[#006699] hover:to-[#0077B6]
                disabled:opacity-50"
            >
              {loading ? "Redirecting to Stripe…" : "Continue to Payment"}
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
