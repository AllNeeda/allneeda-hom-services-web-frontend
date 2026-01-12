"use client";

import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutFormContent from "./CheckoutFormContent";
import { createPaymentIntent } from "@/app/api/services/payment.api";

// Make sure to call `loadStripe` outside of a component's render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

// Dummy subscription plans JSON
const DUMMY_SUBSCRIPTION_PLANS = [
  {
    id: "starter",
    name: "Starter",
    credits: 100,
    price: 80,
  },
  {
    id: "premium",
    name: "Premium",
    credits: 200,
    price: 150,
  },
  {
    id: "gold",
    name: "Gold",
    credits: 800,
    price: 550,
  },
  {
    id: "platinum",
    name: "Platinum",
    credits: 2000,
    price: 1200,
  },
];

// Dummy current user (in real app, fetch from your auth context)
const DUMMY_CURRENT_USER = {
  name: "John Doe",
  email: "john.doe@example.com",
  phone: "+1 (555) 123-4567",
};

export default function CheckoutForm() {
  const [clientSecret, setClientSecret] = useState("");
  const [amount, setAmount] = useState(150);
  const [selectedPlan, setSelectedPlan] = useState("premium");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Create payment intent when amount changes
  useEffect(() => {
    const createPaymentIntentAsync = async () => {
      if (amount <= 0) return;
      
      setLoading(true);
      setError(null);
      try {
        const data = await createPaymentIntent(amount);
        setClientSecret(data.clientSecret);
      } catch (err: any) {
        console.error("Error creating payment intent:", err);
        setError(err.message || "Failed to create payment intent");
      } finally {
        setLoading(false);
      }
    };

    createPaymentIntentAsync();
  }, [amount]);

  const appearance = {
    theme: 'stripe' as const,
    variables: {
      colorPrimary: '#10b981',
      colorBackground: '#ffffff',
      colorText: '#1f2937',
      colorDanger: '#ef4444',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
      spacingUnit: '4px',
      borderRadius: '8px',
    },
  };

  const options = {
    clientSecret,
    appearance,
  };

  const handlePlanChange = (planId: string) => {
    const plan = DUMMY_SUBSCRIPTION_PLANS.find(p => p.id === planId);
    if (plan) {
      setSelectedPlan(planId);
      setAmount(plan.price);
    }
  };

  if (loading && !clientSecret) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Setting up payment...</p>
        </div>
      </div>
    );
  }

  if (error && !clientSecret) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center p-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Payment Setup Failed</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <button
            onClick={() => {
              setError(null);
              const plan = DUMMY_SUBSCRIPTION_PLANS.find(p => p.id === selectedPlan);
              if (plan) {
                setAmount(plan.price);
              }
            }}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-7xl mx-auto">
        {clientSecret ? (
          <Elements stripe={stripePromise} options={options}>
            <CheckoutFormContent
              clientSecret={clientSecret}
              amount={amount}
              selectedPlan={selectedPlan}
              onPlanChange={handlePlanChange}
              subscriptionPlans={DUMMY_SUBSCRIPTION_PLANS}
              currentUser={DUMMY_CURRENT_USER}
              loading={loading}
            />
          </Elements>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">Loading payment form...</p>
          </div>
        )}
      </div>
    </div>
  );
}