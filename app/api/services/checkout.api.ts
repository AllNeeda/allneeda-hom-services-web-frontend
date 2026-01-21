export const createCheckoutSession = async (
  planId: string,
  token: string
) => {
  console.log("The planID: ", planId);
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/payment/create-checkout-session`,
    {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      
      },
      credentials: "include", // important if using cookies/JWT
      body: JSON.stringify({ planId })
    }
  );

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error?.error || "Failed to create checkout session");
  }

  return res.json(); // { url }
};
