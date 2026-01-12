export const createPaymentIntent = async (amount: number) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/payment/create-intent`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ amount }),
    }
  );

  if (!res.ok) {
    throw new Error("Failed to create payment intent");
  }

  return res.json();
};
