import React, { useState, useEffect } from "react";

const EmployeeManagementPricing = () => {
  const [billingCycle, setBillingCycle] = useState("annual");
  const [isVisible, setIsVisible] = useState(false);

  const brandColor = "#0077B6";

  const plans = [
    {
      name: "Starter",
      price: billingCycle === "annual" ? "10" : "12",
      unit: "credits",
      billing: billingCycle === "annual" ? "Billed annually" : "Billed monthly",
      features: [
        "Up to 10 employees",
        "Basic analytics dashboard",
        "Email support",
        "Standard reporting",
      ],
      cta: "Get started",
      description: "Perfect for small teams getting started with HR automation",
    },
    {
      name: "Growth",
      price: billingCycle === "annual" ? "25" : "30",
      unit: "credits",
      billing: billingCycle === "annual" ? "Billed annually" : "Billed monthly",
      features: [
        "Up to 50 employees",
        "Advanced analytics",
        "Priority email support",
        "Custom reporting",
        "HR integration",
        "Performance tracking",
      ],
      cta: "Get started",
      popular: true,
      description: "Ideal for growing businesses scaling their HR operations",
    },
    {
      name: "Enterprise",
      price: "Custom",
      unit: "",
      billing: "Tailored billing",
      features: [
        "Unlimited employees",
        "Premium analytics",
        "24/7 dedicated support",
        "Advanced HR integration",
        "Dedicated account manager",
        "API access",
        "Custom workflows",
        "Single sign-on (SSO)",
      ],
      cta: "Contact sales",
      description:
        "Complete solution for large organizations with complex needs",
    },
  ];

  useEffect(() => {
    setIsVisible(true);

    const handleScroll = () => {
      const element = document.getElementById("pricing-section");
      if (element) {
        const position = element.getBoundingClientRect();
        if (position.top < window.innerHeight * 0.75) {
          setIsVisible(true);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      id="pricing-section"
      className="transition-all duration-500 text-xs px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2 tracking-tight">
            Scalable Employee Management
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Flexible credit-based plans that grow with your organization.
            <span
              className="block mt-1 font-medium"
              style={{ color: brandColor }}
            >
              Only pay for what you use with no long-term commitments.
            </span>
          </p>

          {/* Billing toggle */}
          <div className="flex justify-center space-x-4 my-6 p-1 rounded-full  dark:bg-gray-800">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-5 py-1.5 font-medium rounded-full transition-all duration-300 ${billingCycle === "monthly"
                  ? "text-white shadow"
                  : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                }`}
              style={
                billingCycle === "monthly"
                  ? { backgroundColor: brandColor }
                  : {}
              }
            >
              Monthly billing
            </button>
            <button
              onClick={() => setBillingCycle("annual")}
              className={`px-5 py-1.5 font-medium rounded-full transition-all duration-300 ${billingCycle === "annual"
                  ? "text-white shadow"
                  : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                }`}
              style={
                billingCycle === "annual"
                  ? { backgroundColor: brandColor }
                  : {}
              }
            >
              Annual billing{" "}
              <span className="opacity-70">(save 20%)</span>
            </button>
          </div>
        </div>

        {/* Plans */}
        <div
          className={`grid gap-6 sm:grid-cols-2 lg:grid-cols-3 transition-all duration-700 ${isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8"
            }`}
        >
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative rounded-lg p-6 shadow-lg border transition-all duration-400 hover:shadow-xl hover:-translate-y-1 ${plan.popular
                  ? "border-2 transform scale-[1.02]"
                  : "border-gray-200 dark:border-gray-700"
                } bg-white dark:bg-gray-900`}
              style={plan.popular ? { borderColor: brandColor } : {}}
            >
              {plan.popular && (
                <div
                  className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white font-bold px-3 py-1 rounded-full whitespace-nowrap shadow-md"
                  style={{
                    background: `${brandColor}`,
                  }}
                >
                  Most Popular
                </div>
              )}

              <div className="mb-5">
                <h3
                  className={`font-bold mb-2 ${plan.popular
                      ? "dark:text-white"
                      : "text-gray-900 dark:text-gray-100"
                    }`}
                  style={plan.popular ? { color: brandColor } : {}}
                >
                  {plan.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-3 min-h-[2.5rem] leading-relaxed">
                  {plan.description}
                </p>

                <div className="flex items-baseline mb-1">
                  <span
                    className={`text-2xl font-extrabold ${plan.popular
                        ? "text-gray-900 dark:text-white"
                        : "text-gray-800 dark:text-gray-200"
                      }`}
                  >
                    {plan.price}
                  </span>
                  {plan.unit && (
                    <span className="ml-1.5 text-gray-500 dark:text-gray-400">
                      {plan.unit}
                    </span>
                  )}
                </div>

                <p className="text-gray-500 dark:text-gray-400 mb-5">
                  {plan.billing}
                </p>
              </div>

              <button
                className={`w-full mb-6 py-2.5 px-5 rounded-[4px] font-semibold transition-all duration-300 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2
    ${plan.popular
                    ? "bg-[#0077B6] hover:bg-[#005f87] text-white focus:ring-[#0077B6] focus:ring-offset-white dark:focus:ring-offset-gray-900"
                    : "bg-gray-900 text-white hover:bg-gray-800 focus:ring-gray-500 focus:ring-offset-white dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200 dark:focus:ring-gray-300 dark:focus:ring-offset-gray-900"
                  }`}
              >
                {plan.cta}
              </button>


              <div className="border-t border-gray-100 dark:border-gray-700 pt-5">
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider mb-3">
                  Features
                </h4>
                <ul className="space-y-2 text-[13px]">
                  {plan.features.map((feature, featureIndex) => (
                    <li
                      key={featureIndex}
                      className="flex items-start transition-all duration-300 hover:translate-x-1"
                    >
                      <svg
                        className="h-4 w-4 flex-shrink-0 mt-0.5 mr-2.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke={brandColor}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="text-gray-600 dark:text-gray-300 leading-relaxed">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Footer note */}
        <div className="mt-12 text-center max-w-2xl mx-auto">
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            <span className="font-semibold text-gray-900 dark:text-white">
              Transparent pricing:
            </span>{" "}
            1 credit = $0.02. Credits can be used across all platform features.
            Unused credits roll over monthly.
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmployeeManagementPricing;
