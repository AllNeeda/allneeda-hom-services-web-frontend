export interface CreditPackage {
  _id: string;
  name: string;
  description?: string;
  credits: number;
  price: number;
  currency: string;
  billingType: "one_time" | "monthly" | "yearly";
  isActive: boolean;
  category?: string;
  discountPrice?: number | null;
  createdAt?: string;
  updatedAt?: string;
}