"use client";

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { ProgressBar } from './ProgressBar';
import { motion, AnimatePresence } from 'framer-motion';

const ONBOARDING_STEPS = [
  { id: 1, name: 'Profile' },
  { id: 2, name: 'Reviews' },
  { id: 3, name: 'Preferences' },
  { id: 4, name: 'Location' },
  { id: 5, name: 'Payment' },
  { id: 6, name: 'Background' },
];

export default function PaymentForm() {
  const [isPending, setIspending] = useState(false);
  const [budgetOption, setBudgetOption] = useState<'unlimited' | 'limited' | null>(null);
  const [budgetAmount, setBudgetAmount] = useState(20);
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    fullName: '',
    cardNumber: '',
    expiration: '',
    cvv: ''
  });

  // Get service Id
  const params = useSearchParams()
  const serviceId = params.get('id')

  const router = useRouter();
  const [currentStep] = useState(5);

  const handleNext = () => {
    if (serviceId) {
      setIspending(true)
      router.back()
    }
    setIspending(true)
    router.push(`/home-services/dashboard/services/complete`);
  };

  const handleBack = () => {
    router.back();
  };

  const handleCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCardDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle payment submission
    handleNext();
  };

  return (
    <div className="bg-white dark:bg-gray-900 text-gray-800 dark:text-white text-[13px] px-4 md:px-8 py-6 md:py-10">
      {!serviceId && (
        <ProgressBar
          currentStep={currentStep}
          totalSteps={ONBOARDING_STEPS.length}
          steps={ONBOARDING_STEPS}
          className="mb-8"
        />
      )}

      <div className="">
        <motion.h1
          className="text-2xl font-bold text-gray-800 dark:text-white mb-2"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          Choose how to budget your spending
        </motion.h1>

        <motion.p
          className="text-gray-600 dark:text-gray-300 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.3 }}
        >
          Your budget helps determine how many leads you will get. Update your budget anytime.
        </motion.p>

        <div className="space-y-4 mb-8">
          {/* Unlimited Budget Option */}
          <motion.div
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className={`p-4 border-2 rounded-lg cursor-pointer transition-colors duration-200 ${budgetOption === 'unlimited'
              ? 'border-[#0096C7] bg-[#0096C7]/10'
              : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            onClick={() => setBudgetOption('unlimited')}
          >
            <div className="flex items-start">
              <div className={`flex items-center justify-center h-5 w-5 rounded-full mr-3 mt-0.5 ${budgetOption === 'unlimited'
                ? 'bg-[#0096C7] border-[#0096C7]'
                : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600'
                } border-2`}>
                {budgetOption === 'unlimited' && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="h-2 w-2 rounded-full bg-white"
                  />
                )}
              </div>
              <div>
                <h3 className="font-medium text-gray-800 dark:text-white">Do not limit my budget</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  This allows you to get all the leads that fit your exact job preferences. You can always change this later.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Limited Budget Option */}
          <motion.div
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className={`p-4 border-2 rounded-lg cursor-pointer transition-colors duration-200 ${budgetOption === 'limited'
              ? 'border-[#0096C7] bg-[#0096C7]/10'
              : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            onClick={() => setBudgetOption('limited')}
          >
            <div className="flex items-start">
              <div className={`flex items-center justify-center h-5 w-5 rounded-full mr-3 mt-0.5 ${budgetOption === 'limited'
                ? 'bg-[#0096C7] border-[#0096C7]'
                : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600'
                } border-2`}>
                {budgetOption === 'limited' && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="h-2 w-2 rounded-full bg-white"
                  />
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-800 dark:text-white">Limit my budget</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Set a limit on how much you will spend per week.
                </p>

                <AnimatePresence>
                  {budgetOption === 'limited' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mt-4 overflow-hidden"
                    >
                      <div className="flex items-center">
                        <span className="text-gray-700 dark:text-gray-300 mr-2">Credits</span>
                        <input
                          type="number"
                          min="20"
                          value={budgetAmount}
                          onChange={(e) => setBudgetAmount(Math.max(20, Number(e.target.value)))}
                          className="w-24 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0096C7] focus:border-[#0096C7] dark:bg-gray-800 dark:text-white"
                        />
                        <span className="text-gray-700 dark:text-gray-300 ml-2">per week</span>

                        <div
                          className="ml-3 relative"
                          onMouseEnter={() => setIsTooltipVisible(true)}
                          onMouseLeave={() => setIsTooltipVisible(false)}
                        >
                          <svg className="w-5 h-5 text-gray-400 hover:text-[#0096C7]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>

                          {isTooltipVisible && (
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="absolute left-0 bottom-full mb-2 w-64 p-3 text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10"
                            >
                              A ${budgetAmount} budget will still help you establish your business quickly, but we not get you as many leads as possible. The minimum budget is $20.
                            </motion.div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Payment Section - Only shows after budget selection */}
        <AnimatePresence>
          {budgetOption && (
            <motion.section
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="max-w-4xl mx-auto"
            >
              <div className="mb-6">
                <h3 className="font-medium text-lg mb-4 text-gray-800 dark:text-white">Payment Information</h3>
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <span>256-bit SSL Encryption</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <span>PCI DSS Compliant</span>
                  </div>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Your payment information is processed securely. We do not store your credit card details.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="w-full rounded-[4px] border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 sm:p-8 shadow-sm">
                <div className="mb-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Full name*</label>
                      <input
                        type="text"
                        name="fullName"
                        value={cardDetails.fullName}
                        onChange={handleCardChange}
                        required
                        placeholder="John Doe"
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-[4px] focus:outline-none focus:ring-2 focus:ring-[#0096C7] dark:bg-gray-800 dark:text-white text-sm"
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Card number*</label>
                      <input
                        type="text"
                        name="cardNumber"
                        value={cardDetails.cardNumber}
                        onChange={handleCardChange}
                        required
                        placeholder="xxxx xxxx xxxx xxxx"
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-[4px] focus:outline-none focus:ring-2 focus:ring-[#0096C7] dark:bg-gray-800 dark:text-white text-sm"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Expiration*</label>
                      <input
                        type="text"
                        name="expiration"
                        value={cardDetails.expiration}
                        onChange={handleCardChange}
                        required
                        placeholder="MM/YY"
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-[4px] focus:outline-none focus:ring-2 focus:ring-[#0096C7] dark:bg-gray-800 dark:text-white text-sm"
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">CVV*</label>
                      <input
                        type="text"
                        name="cvv"
                        value={cardDetails.cvv}
                        onChange={handleCardChange}
                        required
                        placeholder="•••"
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-[4px] focus:outline-none focus:ring-2 focus:ring-[#0096C7] dark:bg-gray-800 dark:text-white text-sm"
                      />
                    </div>
                  </div>
                </div>

              </form>
            </motion.section>
          )}
        </AnimatePresence>

        <div className="fixed bottom-6 right-6 flex gap-4 text-[13px]">
          <button
            onClick={handleBack}
            type="button"
            className="bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white mt-6 py-2 px-5 rounded-[4px] hover:bg-gray-400 dark:hover:bg-gray-600 transition"
          >
            Back
          </button>
          {budgetOption && (
            <button
              type="button"
              disabled={!budgetOption}
              onClick={handleNext}
              className={`mt-6 py-2 px-6 rounded-[4px] flex items-center justify-center gap-2 text-white text-[13px] transition duration-300 ${!budgetOption
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#0096C7] hover:bg-[#005f8e]"
                }`}
            >
              {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              <span>Next</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}