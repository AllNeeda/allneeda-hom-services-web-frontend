"use client";

import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const EditPayment = () => {
  const [selectedPayment, setSelectedPayment] = useState<string[]>([]);

  const paymentMethods = [
    { label: "Apple Pay", value: "apple-pay" },
    { label: "Cash", value: "cash" },
    { label: "Check", value: "check" },
    { label: "Credit Card", value: "credit-card" },
    { label: "Google Pay", value: "google-pay" },
    { label: "Paypal", value: "paypal" },
    { label: "Samsung Pay", value: "samsung-pay" },
    { label: "Square Cash App", value: "square-cash-app" },
    { label: "Stripe", value: "stripe" },
    { label: "Venmo", value: "venmo" },
    { label: "Zelle", value: "zelle" },
  ];

  const handleSelectPayment = (checked: boolean, value: string) => {
    if (checked) {
      setSelectedPayment((prev) => [...prev, value]);
    } else {
      setSelectedPayment((prev) => prev.filter((v) => v !== value));
    }
  };

  const handleSubmit = () => {
    console.log("submitted payment method: ", selectedPayment);
  };

  return (
    <div className="p-4">
      <h1 className="font-bold mb-3 text-lg">Add Payment Method</h1>

      <div className="space-y-3">
        {paymentMethods.map((item) => (
          <div key={item.value} className="flex items-center space-x-2">
            <Checkbox
              id={item.value}
              checked={selectedPayment.includes(item.value)}
              onCheckedChange={(checked) =>
                handleSelectPayment(!!checked, item.value)
              }
            />
            <Label htmlFor={item.value}>{item.label}</Label>
          </div>
        ))}

        <button
          type="button"
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default EditPayment;
