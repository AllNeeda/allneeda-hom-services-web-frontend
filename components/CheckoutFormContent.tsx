"use client";
import React from "react";
import { useState } from "react";
import { useStripe, useElements, PaymentElement, ExpressCheckoutElement } from "@stripe/react-stripe-js";
import {
  CreditCard,
  Lock,
//   Shield,
  CheckCircle,
  AlertCircle,
  Loader2,
//   BadgeCheck,
  Zap,
//   Check,
  Star,
  Trophy,
  Crown,
  Sparkles,
//   Clock,
//   Users,
//   Download,
  User,
  Mail,
  Smartphone,
  BanknoteArrowUp,
} from "lucide-react";

interface CheckoutFormContentProps {
  clientSecret: string;
  amount: number;
  selectedPlan: string;
  /* eslint-disable no-unused-vars */
  onPlanChange: (planId: string) => void;
  /* eslint-enable no-unused-vars */
  subscriptionPlans: any[];
  currentUser: any;
  loading: boolean;
}

export default function CheckoutFormContent({
  clientSecret,
  amount,
  selectedPlan,
  onPlanChange,
  subscriptionPlans,
  currentUser,
  loading,
}: CheckoutFormContentProps) {
  const stripe = useStripe();
  const elements = useElements();

  const [paymentLoading, setPaymentLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [paymentReady, setPaymentReady] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setPaymentLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const result = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/payment/success`,
          payment_method_data: {
            billing_details: {
              name: currentUser.name,
              email: currentUser.email,
              phone: currentUser.phone,
            },
          },
        },
        redirect: 'if_required',
      });

      if (result.error) {
        setError(result.error.message || "Payment failed. Please try again.");
      } else if (result.paymentIntent?.status === "succeeded") {
        setSuccess(true);
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    }

    setPaymentLoading(false);
  };

  const paymentElementOptions = {
    layout: {
      type: "tabs" as const,
      defaultCollapsed: false,
    },
    fields: {
      billingDetails: {
        name: "never" as const,
        email: "never" as const,
        phone: "never" as const,
        address: {
          country: "never" as const,
          postalCode: "never" as const,
        },
      },
    },
    business: {
      name: "Your Company",
    },
    paymentMethodOrder: ['card', 'paypal', 'link', 'apple_pay', 'google_pay'],
  };

  const planIcons: Record<string, any> = {
    starter: Star,
    premium: Trophy,
    gold: Crown,
    platinum: Sparkles,
  };

  return (
    <>
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold mb-3 text-gray-900 dark:text-white">Buy Credit</h1>
        <p className="text-gray-600 dark:text-gray-400">Choose a plan and complete your secure payment</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Sidebar - User Info & Plans */}
        <div className="lg:col-span-1 space-y-6">
          {/* Current User Info */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-sm p-4">
            <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
              <User className="h-5 w-5 text-blue-500" />
              Your Information
            </h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-1 rounded-sm bg-gray-50 dark:bg-gray-700/50">
                <User className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Name</div>
                  <div className="font-medium text-gray-900 dark:text-white">{currentUser.name}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-1 rounded-sm bg-gray-50 dark:bg-gray-700/50">
                <Mail className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Email</div>
                  <div className="font-medium text-gray-900 dark:text-white">{currentUser.email}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-1 rounded-sm bg-gray-50 dark:bg-gray-700/50">
                <Smartphone className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Phone</div>
                  <div className="font-medium text-gray-900 dark:text-white">{currentUser.phone}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Subscription Plans */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-sm p-4">
            <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-2">
              <Trophy className="h-5 w-5 text-amber-500" />
              Choose Your Plan
            </h2>
            
            <div className="space-y-4">
              {subscriptionPlans.map((plan) => {
                const IconComponent = planIcons[plan.id] || Star;
                return (
                  <div
                    key={plan.id}
                    onClick={() => !loading && onPlanChange(plan.id)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                      selectedPlan === plan.id
                        ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/10 ring-2 ring-emerald-500/20"
                        : "border-gray-200 dark:border-gray-700 hover:border-emerald-300 dark:hover:border-emerald-600 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                    } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${
                          selectedPlan === plan.id 
                            ? 'bg-emerald-100 dark:bg-emerald-900/20' 
                            : 'bg-gray-100 dark:bg-gray-700'
                        }`}>
                          <IconComponent className={`h-5 w-5 ${
                            selectedPlan === plan.id 
                              ? 'text-emerald-600 dark:text-emerald-400' 
                              : 'text-gray-500 dark:text-gray-400'
                          }`} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">{plan.name}</h3>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{plan.description}</p>
                        </div>
                      </div>
                      {plan.popular && (
                        <span className="px-2 py-1 text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-full">
                          Popular
                        </span>
                      )}
                      {loading && selectedPlan === plan.id && (
                        <Loader2 className="h-4 w-4 animate-spin text-emerald-600" />
                      )}
                    </div>

                    <div className="mb-4">
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-bold text-gray-900 dark:text-white">${plan.price}</span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">/month</span>
                      </div>
                      <div className="text-sm text-emerald-500 font-bold dark:text-emerald-400 mt-1 flex flex-row items-center gap-2">
                        <BanknoteArrowUp />
                        <p>{plan.credits.toLocaleString()} credits</p>
                      </div>
                    </div>

                    {/* <div className="space-y-2">
                      {plan.features.map((feature: string, idx: number) => (
                        <div key={idx} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                          <Check className="h-4 w-4 text-emerald-500" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div> */}
                  </div>
                );
              })}
            </div>

            {/* Current Selection */}
            <div className="mt-8 p-4 rounded-lg bg-gradient-to-r from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 border border-emerald-200 dark:border-emerald-700/30">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white">Selected Plan</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {subscriptionPlans.find(p => p.id === selectedPlan)?.name}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">${amount}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Security Badges */}
          {/* <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm">
            <h3 className="font-semibold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
              <Shield className="h-5 w-5 text-emerald-500" />
              Security & Trust
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 text-center">
                <Shield className="h-5 w-5 text-emerald-500 mx-auto mb-2" />
                <div className="text-xs font-medium text-gray-900 dark:text-white">PCI DSS</div>
              </div>
              <div className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 text-center">
                <Lock className="h-5 w-5 text-blue-500 mx-auto mb-2" />
                <div className="text-xs font-medium text-gray-900 dark:text-white">256-bit SSL</div>
              </div>
              <div className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 text-center">
                <BadgeCheck className="h-5 w-5 text-purple-500 mx-auto mb-2" />
                <div className="text-xs font-medium text-gray-900 dark:text-white">Verified</div>
              </div>
              <div className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 text-center">
                <Clock className="h-5 w-5 text-amber-500 mx-auto mb-2" />
                <div className="text-xs font-medium text-gray-900 dark:text-white">24/7 Support</div>
              </div>
            </div>
          </div> */}
        </div>

        {/* Main Payment Form */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-sm overflow-hidden">
            {/* Form Header */}
            <div className="px-8 py-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-900/90">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/20">
                    <CreditCard className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Payment Information</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Complete your subscription payment</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                  <Lock className="h-4 w-4" />
                  <span className="text-sm font-medium">Secure Checkout</span>
                </div>
              </div>
            </div>

            <div className="p-8">
              {/* Order Summary */}
              <div className="mb-8 p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/20">
                <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Payment Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Plan</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {subscriptionPlans.find(p => p.id === selectedPlan)?.name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Credits</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {subscriptionPlans.find(p => p.id === selectedPlan)?.credits.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Billing Cycle</span>
                    <span className="font-medium text-gray-900 dark:text-white">Monthly</span>
                  </div>
                  <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-gray-900 dark:text-white">Total Amount</span>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">${amount}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">USD • Monthly</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Express Checkout (Apple Pay, Google Pay, PayPal) */}
              {!loading && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Quick Checkout</h3>
                  <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                    <ExpressCheckoutElement
                      onConfirm={async () => {
                        if (!stripe || !elements) return;
                        
                        setPaymentLoading(true);
                        setError(null);
                        
                        try {
                          const result = await stripe.confirmPayment({
                            elements,
                            clientSecret,
                            confirmParams: {
                              return_url: `${window.location.origin}/payment/success`,
                            },
                            redirect: 'if_required',
                          });
                          
                          if (result.error) {
                            setError(result.error.message || "Payment failed.");
                          } else if (result.paymentIntent?.status === "succeeded") {
                            setSuccess(true);
                          }
                        } catch (err: any) {
                          setError(err.message || "An unexpected error occurred.");
                        }
                        
                        setPaymentLoading(false);
                      }}
                    />
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-3 text-center">
                    Or continue with other payment methods
                  </p>
                </div>
              )}

              {/* Payment Element */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Payment Details</h3>
                  {loading ? (
                    <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 flex items-center justify-center h-40">
                      <div className="text-center">
                        <Loader2 className="h-8 w-8 animate-spin text-emerald-600 mx-auto mb-2" />
                        <p className="text-gray-600 dark:text-gray-400">Updating payment form...</p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                        <PaymentElement 
                          options={paymentElementOptions}
                          onChange={(event) => {
                            setPaymentReady(event.complete);
                          }}
                        />
                      </div>
                      
                      {/* Accepted Payment Methods */}
                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                          <Lock className="h-4 w-4 text-emerald-500" />
                          <span>Bank-level encryption</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-xs font-medium text-gray-900 dark:text-white">Accepted:</div>
                          <div className="flex gap-2">
                            <div className="w-10 h-6 bg-gradient-to-r from-blue-500 to-blue-700 rounded flex items-center justify-center text-xs font-bold text-white">
                              VISA
                            </div>
                            <div className="w-10 h-6 bg-gradient-to-r from-red-500 to-yellow-500 rounded flex items-center justify-center text-xs font-bold text-white">
                              MC
                            </div>
                            <div className="w-10 h-6 bg-gradient-to-r from-blue-400 to-blue-600 rounded flex items-center justify-center text-xs font-bold text-white">
                              AMEX
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Terms & Submit */}
                <div className="space-y-6">
                  <div className="flex items-start gap-3 p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/20">
                    <input
                      type="checkbox"
                      id="terms"
                      className="mt-0.5 rounded border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-emerald-500/20 text-emerald-600"
                      required
                    />
                    <label htmlFor="terms" className="text-sm text-gray-700 dark:text-gray-300">
                      I authorize this payment and agree to the{" "}
                      <a href="#" className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium">Terms of Service</a> and{" "}
                      <a href="#" className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium">Privacy Policy</a>
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={!stripe || paymentLoading || !paymentReady || loading}
                    className="w-full py-4 rounded-xl font-semibold text-lg text-white transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-emerald-500 group-hover:from-emerald-500 group-hover:to-emerald-400 transition-all duration-300" />
                    <div className="relative flex items-center justify-center gap-3">
                      {paymentLoading ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin" />
                          Processing Payment...
                        </>
                      ) : (
                        <>
                          <Zap className="h-5 w-5" />
                          Pay ${amount} Now
                          <Lock className="h-4 w-4" />
                        </>
                      )}
                    </div>
                  </button>
                </div>
              </form>

              {/* Status Messages */}
              {error && (
                <div className="mt-6 animate-in slide-in-from-bottom-2 duration-300">
                  <div className="p-4 rounded-xl border border-red-500/30 bg-red-500/5 flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-red-600">Payment Failed</p>
                      <p className="text-sm text-red-600/90 mt-1">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              {success && (
                <div className="mt-6 animate-in slide-in-from-bottom-2 duration-300">
                  <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-emerald-600">Payment Successful! 🎉</p>
                      <p className="text-sm text-emerald-600/90 mt-1">
                        Your subscription is now active. A receipt has been sent to {currentUser.email}
                      </p>
                      <div className="mt-3 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                        <div className="text-sm font-mono text-gray-900 dark:text-white">
                          Transaction ID: TXN_{Math.random().toString(36).substr(2, 9).toUpperCase()}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Trust Footer */}
          {/* <div className="mt-8 p-6 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="flex flex-col items-center">
                <Shield className="h-8 w-8 text-emerald-500 mb-3" />
                <div className="font-semibold text-gray-900 dark:text-white">PCI DSS Compliant</div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Highest security standard</p>
              </div>
              <div className="flex flex-col items-center">
                <Lock className="h-8 w-8 text-blue-500 mb-3" />
                <div className="font-semibold text-gray-900 dark:text-white">256-bit Encryption</div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Bank-level security</p>
              </div>
              <div className="flex flex-col items-center">
                <BadgeCheck className="h-8 w-8 text-purple-500 mb-3" />
                <div className="font-semibold text-gray-900 dark:text-white">Money-back Guarantee</div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">30-day refund policy</p>
              </div>
            </div>
          </div> */}
        </div>
      </div>

      {/* Global Footer */}
      <footer className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700 text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          © {new Date().getFullYear()} SecurePay. All payments are processed securely.
        </p>
        <div className="mt-4 flex justify-center gap-6 text-sm">
          <a href="#" className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
            Privacy Policy
          </a>
          <a href="#" className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
            Terms of Service
          </a>
          <a href="#" className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
            Refund Policy
          </a>
          <a href="#" className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
            Contact Support
          </a>
        </div>
      </footer>
    </>
  );
}