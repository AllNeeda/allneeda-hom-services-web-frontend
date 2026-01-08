"use client";

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { ProgressBar } from './ProgressBar';
import { useGetCreditPackage } from '@/hooks/useCredits';
import { getAccessToken } from '@/app/api/axios';
import GlobalLoader from '@/components/ui/global-loader';

const ONBOARDING_STEPS = [
  { id: 1, name: 'Profile' },
  { id: 2, name: 'Reviews' },
  { id: 3, name: 'Preferences' },
  { id: 4, name: 'Location' },
  { id: 5, name: 'Payment' },
  { id: 6, name: 'Background' },
];

interface CreditPackage {
  _id: string;
  name: string;
  credits: number;
  price: number;
  currency: string;
  billingType: string;
  category: string;
  description: string;
  discountPrice: number | null;
  isActive: boolean;
}

type PlanType = 'monthly' | 'one_time' | 'annual';

export default function PaymentForm() {
  const token = getAccessToken() || '';
  const { data: creditsData, isLoading, isError } = useGetCreditPackage(token!);

  const params = useSearchParams()
  const serviceId = params.get('id')
  const [currentStep] = useState(5);
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [packages, setPackages] = useState<CreditPackage[]>([]);
  const [activeTab, setActiveTab] = useState<PlanType>('monthly');
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  // Extract packages from response
  useEffect(() => {
    if (creditsData) {
      try {
        let packagesArray: CreditPackage[] = [];

        if (Array.isArray(creditsData)) {
          packagesArray = creditsData;
        } else if (creditsData?.data && Array.isArray(creditsData.data)) {
          packagesArray = creditsData.data;
        } else if (creditsData?.data?.data && Array.isArray(creditsData.data.data)) {
          packagesArray = creditsData.data.data;
        } else if (creditsData?.result && Array.isArray(creditsData.result)) {
          packagesArray = creditsData.result;
        } else if (typeof creditsData === 'object') {
          const arrayKeys = Object.keys(creditsData).filter(key =>
            Array.isArray(creditsData[key as keyof typeof creditsData])
          );
          if (arrayKeys.length > 0) {
            packagesArray = creditsData[arrayKeys[0] as keyof typeof creditsData] as CreditPackage[];
          }
        }

        // Filter only active packages
        const activePackages = packagesArray.filter(
          (pkg: any) => pkg.isActive !== false && pkg.isActive !== undefined
        );

        // Further filter to only include packages in the 'payment' category (case-insensitive)
        const paymentPackages = activePackages.filter((pkg: any) => {
          if (!pkg || !pkg.category) return false;
          return String(pkg.category).toLowerCase() === 'payment';
        });

        setPackages(paymentPackages);

      } catch {
        setPackages([]);
      }
    } else {
      setPackages([]);
    }
  }, [creditsData]);

  // Categorize packages
  const oneTimePackages = packages.filter(pkg =>
    pkg.billingType && (
      pkg.billingType === 'one_time' ||
      pkg.billingType.toLowerCase().includes('one') ||
      pkg.name?.toLowerCase().includes('one time')
    )
  );

  const monthlyPackages = packages.filter(pkg =>
    pkg.billingType && (
      pkg.billingType === 'monthly' ||
      pkg.billingType.toLowerCase().includes('month') ||
      pkg.name?.toLowerCase().includes('monthly')
    )
  );

  const annualPackages = packages.filter(pkg =>
    pkg.billingType && (
      pkg.billingType === 'yearly' ||
      pkg.billingType === 'annual' ||
      pkg.billingType.toLowerCase().includes('year') ||
      pkg.name?.toLowerCase().includes('yearly') ||
      pkg.name?.toLowerCase().includes('annual')
    )
  );

  // Get current packages based on active tab
  const getCurrentPackages = () => {
    switch (activeTab) {
      case 'one_time': return oneTimePackages;
      case 'monthly': return monthlyPackages;
      case 'annual': return annualPackages;
      default: return monthlyPackages;
    }
  };

  // Format price display
  const formatPrice = (price: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Calculate discount percentage
  const calculateDiscountPercentage = (originalPrice: number, discountPrice: number | null) => {
    if (!discountPrice || discountPrice >= originalPrice) return null;
    const percentage = Math.round(((originalPrice - discountPrice) / originalPrice) * 100);
    return percentage > 0 ? percentage : null;
  };

  const handleSelectPackage = (packageId: string) => {
    setSelectedPackage(packageId);
  };

  if (isLoading) {
    return (
      <GlobalLoader></GlobalLoader>
    );
  }

  if (isError) {
    return (
      <div className="bg-white text-gray-800 dark:text-white px-4 md:px-6 lg:px-8 py-6 md:py-8 text-[13px]">
        <div className="text-center py-8">
          <div className="w-12 h-12 mx-auto mb-4 text-red-500">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="font-semibold text-[#0077B6] dark:text-white mb-2">Error Loading Packages</h3>
          <p className="text-gray-600 dark:text-[#0077B6] mb-4">Please try refreshing the page</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-sm text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const currentPackages = getCurrentPackages();

  return (
    <div className="bg-white dark:bg-gray-900 text-gray-800 dark:text-white px-4 md:px-6 lg:px-8 py-6 md:py-8 text-[13px]">
      {!serviceId && (
        <div className="mb-6 md:mb-8">
          <ProgressBar
            currentStep={currentStep}
            totalSteps={ONBOARDING_STEPS.length}
            steps={ONBOARDING_STEPS}
            className="mb-4"
          />
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-xl md:text-2xl font-bold text-[#0077B6] dark:text-white mb-2 md:mb-3">
            Choose Your Plan
          </h2>
          <p className="text-gray-600 dark:text-[#0077B6] max-w-2xl mx-auto text-[11px] md:text-[12px] leading-relaxed px-4">
            Select the perfect plan for your needs. All plans include our core features with flexible billing options.
          </p>
        </div>

        {/* Modern Minimalist Tabs */}
        <div className="flex justify-center mb-4 md:mb-4">
          <div className="inline-flex bg-gray-50 dark:bg-gray-800/30 rounded-sm md:rounded-sm p-0.5 md:p-1 border border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setActiveTab('monthly')}
              className={`px-3 md:px-5 py-1.5 md:py-2 text-[11px] md:text-[12px] font-medium rounded-sm md:rounded-sm transition-all duration-200 ${activeTab === 'monthly'
                  ? 'bg-white dark:bg-[#026ba3] text-gray-800 shadow-xs border border-gray-300 dark:border-gray-600'
                  : 'text-gray-600 dark:text-gra hover:text-[#0077B6] dark:hover:text-white'
                }`}
            >
              Monthly
            </button>

            <button
              onClick={() => setActiveTab('annual')}
              className={`px-3 md:px-5 py-1.5 md:py-2 text-[11px] md:text-[12px] font-medium rounded-sm md:rounded-sm transition-all duration-200 mx-0.5 md:mx-1 ${activeTab === 'annual'
                  ? 'bg-white dark:bg-[#026ba3] text-gray-800 shadow-xs border border-gray-300 dark:border-gray-600'
                  : 'text-gray-600 dark:text-[#0077B6] hover:text-[#0077B6] dark:hover:text-white'
                }`}
            >
              Annual
            </button>

            <button
              onClick={() => setActiveTab('one_time')}
              className={`px-3 md:px-5 py-1.5 md:py-2 text-[11px] md:text-[12px] font-medium rounded-sm md:rounded-sm transition-all duration-200 ${activeTab === 'one_time'
                  ? 'bg-white dark:bg-[#0077B6] text-gray-800 shadow-xs border border-gray-300 dark:border-gray-600'
                  : 'text-gray-600 dark:text-gray-100 hover:text-[#0077B6] dark:hover:text-white'
                }`}
            >
              One-Time
            </button>
          </div>
        </div>

        {/* Plan Cards Grid - Redesigned Modern Layout */}
        {currentPackages.length === 0 ? (
          <div className="text-center py-8 md:py-12">
            <div className="bg-gray-100 dark:bg-gray-800 w-10 h-10 md:w-12 md:h-12 rounded-sm md:rounded-sm flex items-center justify-center mx-auto mb-3 md:mb-4">
              <svg className="w-5 h-5 md:w-6 md:h-6 text-[#0077B6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-semibold text-[#0077B6] dark:text-white mb-1 md:mb-2 text-sm">No Plans Available</h3>
            <p className="text-gray-600 dark:text-[#0077B6] text-[11px] md:text-[12px] leading-relaxed max-w-md mx-auto">
              No {activeTab} plans are currently available. Please check other billing options.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 max-w-5xl mx-auto">
            {currentPackages.map((pkg, index) => {
              const isPopular = index === 1;
              const isSelected = selectedPackage === pkg._id;
              const hasDiscount = pkg.discountPrice && pkg.discountPrice < pkg.price;
              const discountPercentage = hasDiscount
                ? calculateDiscountPercentage(pkg.price, pkg.discountPrice)
                : null;

              return (
                <div
                  key={pkg._id}
                  onMouseEnter={() => setHoveredCard(pkg._id)}
                  onMouseLeave={() => setHoveredCard(null)}
                  className={`relative rounded-sm md:rounded-sm border transition-all duration-300 ${isSelected
                      ? 'border-[#0077B6] shadow-md ring-2 ring-[#0077B6]/20'
                      : isPopular
                        ? 'border-blue-200 dark:border-[#0077B6] shadow-sm'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    } ${hoveredCard === pkg._id && !isSelected ? 'shadow-lg -translate-y-1' : ''}`}
                >

                  {/* Discount Badge */}
                  {hasDiscount && discountPercentage && (
                    <div className="absolute -top-2 -right-2 z-10">
                      <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-[10px] font-bold shadow-md">
                        SAVE {discountPercentage}%
                      </div>
                    </div>
                  )}

                  {/* Card Content */}
                  <div className={`p-5 md:p-6 rounded-sm md:rounded-sm ${isPopular
                      ? 'bg-gradient-to-b from-blue-50/40 to-white dark:from-blue-900/10 dark:to-gray-800'
                      : 'bg-white dark:bg-gray-800'
                    }`}>
                    {/* Package Name - Centered */}
                    <h3 className="font-bold text-[#0077B6] dark:text-white text-[15px] leading-tight mb-3 text-center">
                      {pkg.name}
                    </h3>

                    {/* Credits Badge - Centered */}
                    <div className="mb-4 flex justify-center">
                      <div className="inline-flex items-cente px-4 py-3 rounded-sm">
                        <div className="flex items-center">
                          <svg className="w-5 h-5 text-[#0077B6] dark:text-blue-300 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                          </svg>
                          <span className=" font-normal  text-gray-800 text-sm">
                            {pkg.credits} Credits
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Price Section - Centered */}
                    <div className="mb-5 text-center">
                      {hasDiscount && pkg.discountPrice ? (
                        <div className="space-y-2">
                          {/* Original Price with Strike-through */}
                          <div className="flex justify-center items-baseline">
                            <span className="text-gray-400 dark:text-gray-500 line-through text-sm md:text-base">
                              {formatPrice(pkg.price, pkg.currency)}
                            </span>
                            <span className="ml-2 text-xs bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-300 px-2 py-0.5 rounded-sm">
                              Save {formatPrice(pkg.price - pkg.discountPrice, pkg.currency)}
                            </span>
                          </div>

                          {/* Discount Price - Highlighted */}
                          <div className="flex justify-center items-baseline">
                            <span className="text-3xl md:text-4xl font-bold text-[#0077B6] dark:text-white">
                              {formatPrice(pkg.discountPrice, pkg.currency)}
                            </span>
                            <span className="text-gray-600 dark:text-gray-300 ml-2 text-sm">
                              {activeTab === 'monthly' ? '/month' : activeTab === 'annual' ? '/year' : ''}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="flex justify-center items-baseline">
                          <span className="text-3xl md:text-4xl font-bold text-[#0077B6] dark:text-white">
                            {formatPrice(pkg.price, pkg.currency)}
                          </span>
                          <span className="text-gray-600 dark:text-gray-300 ml-2 text-sm">
                            {activeTab === 'monthly' ? '/month' : activeTab === 'annual' ? '/year' : ''}
                          </span>
                        </div>
                      )}

                      {/* Billing Period */}
                      <div className="text-gray-500 dark:text-gray-400 mt-2 text-[12px]">
                        {activeTab === 'monthly' && 'Billed monthly'}
                        {activeTab === 'annual' && 'Billed annually'}
                        {activeTab === 'one_time' && 'One-time payment'}
                      </div>
                    </div>

                    {/* Description - Centered */}
                    {pkg.description && (
                      <div className="mb-5 text-center">
                        <p className="text-gray-600 dark:text-gray-300 text-[12px] leading-relaxed px-2">
                          {pkg.description}
                        </p>
                      </div>
                    )}

                    {/* Action Button - Centered */}
                    <div className="text-center">
                      <button
                        onClick={() => handleSelectPackage(pkg._id)}
                        className={`w-full max-w-xs py-3 rounded-sm text-[13px] font-semibold transition-all duration-200 flex items-center justify-center gap-2 mx-auto ${isSelected
                            ? 'bg-gradient-to-r from-[#0077B6] to-[#00A8E8] text-white shadow-md'
                            : isPopular
                              ? 'bg-gradient-to-r from-[#0077B6] to-[#00A8E8] text-white hover:from-[#006699] hover:to-[#0077B6] shadow-sm hover:shadow-md'
                              : 'bg-gray-100 dark:bg-gray-700 text-[#0077B6] dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600 hover:shadow-sm'
                          }`}
                      >
                        {isSelected ? (
                          <>
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Selected
                          </>
                        ) : (
                          <>
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Select Plan
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}

        {/* Selected Package Summary - Centered */}
        {selectedPackage && (
          <div className="mt-8 md:mt-10 max-w-5xl mx-auto">
            <div className="bg-gradient-to-r from-blue-50/50 to-white dark:from-gray-800/30 dark:to-gray-800/20 rounded-sm border border-blue-200 dark:border-blue-700/50 p-6 md:p-8 shadow-sm">
              <div className="flex flex-col items-center text-center">
                <h3 className="font-bold text-[#0077B6] dark:text-white mb-6 text-base md:text-lg flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                    <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                  </svg>
                  Order Summary
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 w-full max-w-3xl">
                  {/* Plan Name */}
                  <div className="bg-white/80 dark:bg-gray-800/50 p-4 rounded-sm border border-gray-200 dark:border-gray-700">
                    <div className="text-gray-600 dark:text-gray-300 text-sm mb-2">Plan Name</div>
                    <div className="font-bold text-[#0077B6] dark:text-white text-base">
                      {packages.find(p => p._id === selectedPackage)?.name}
                    </div>
                  </div>

                  {/* Credits */}
                  <div className="bg-white/80 dark:bg-gray-800/50 p-4 rounded-sm border border-gray-200 dark:border-gray-700">
                    <div className="text-gray-600 dark:text-gray-300 text-sm mb-2">Credits</div>
                    <div className="flex items-center justify-center">
                      <span className="font-bold text-[#0077B6] dark:text-white text-xl mr-2">
                        {packages.find(p => p._id === selectedPackage)?.credits}
                      </span>
                      <span className="text-gray-500 dark:text-gray-400 text-sm">credits</span>
                    </div>
                  </div>

                  {/* Billing Cycle */}
                  <div className="bg-white/80 dark:bg-gray-800/50 p-4 rounded-sm border border-gray-200 dark:border-gray-700">
                    <div className="text-gray-600 dark:text-gray-300 text-sm mb-2">Billing Cycle</div>
                    <div className="font-bold text-[#0077B6] dark:text-white text-base">
                      {(() => {
                        const pkg = packages.find(p => p._id === selectedPackage);
                        if (oneTimePackages.includes(pkg!)) return 'One-Time';
                        if (monthlyPackages.includes(pkg!)) return 'Monthly';
                        if (annualPackages.includes(pkg!)) return 'Annual';
                        return 'Package';
                      })()}
                    </div>
                  </div>
                </div>

                {/* Total Amount - Centered */}
                <div className="bg-gradient-to-r from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/20 p-6 rounded-sm border border-blue-200 dark:border-blue-700/30 w-full max-w-md mb-6">
                  <div className="text-gray-600 dark:text-gray-300 mb-3 text-sm">Total Amount</div>
                  <div className="flex items-baseline justify-center">
                    <span className="text-4xl font-bold text-[#0077B6] dark:text-white">
                      {formatPrice(
                        (packages.find(p => p._id === selectedPackage)?.discountPrice ||
                          packages.find(p => p._id === selectedPackage)?.price) || 0,
                        packages.find(p => p._id === selectedPackage)?.currency || 'USD'
                      )}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400 ml-3 text-base">
                      {activeTab === 'monthly' && '/month'}
                      {activeTab === 'annual' && '/year'}
                      {activeTab === 'one_time' && 'one-time'}
                    </span>
                  </div>
                </div>

                {/* Continue Button - Centered */}
                <div className="text-center">
                  <button className="px-10 py-4 bg-gradient-to-r from-[#0077B6] to-[#00A8E8] text-white rounded-sm text-base font-semibold hover:from-[#006699] hover:to-[#0077B6] transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2 group mx-auto">
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
                    </svg>
                    Continue to Payment
                  </button>
                  <p className="text-gray-500 dark:text-gray-400 mt-3 text-center text-[12px] flex items-center justify-center gap-1">
                    <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Secure SSL encrypted • 256-bit security
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}