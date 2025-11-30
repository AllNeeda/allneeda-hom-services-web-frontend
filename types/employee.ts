export interface PricingPlan {
  name: string;
  price: string;
  unit: string;
  billing: string;
  features: string[];
  cta: string;
  popular?: boolean;
}

export interface PricingCardProps {
  plan: PricingPlan;
  expanded: boolean;
  onClick: () => void;
}

