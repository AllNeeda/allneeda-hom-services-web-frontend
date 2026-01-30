
export interface Professional {
  _id: string;
  company: string;
  type: string;
  service: string;
  rating: number;
  services: string[];
  zipCodes: string[];
  distance?: number;
  guarantee: boolean;
  employee_count: number;
  total_hires: number;
  founded: number;
  background_check: boolean;
  status: string;
  description: string;
  imageUrl: string;
  apiData?: {
    maximum_price: number;
    minimum_price: number;
    pricing_type: string;
    completed_tasks: number;
    professional_id: string;
  };
}

export interface GoogleProfessional {
  place_id: string;
  name: string;
  formatted_address: string;
  formatted_phone_number: string;
  rating: number | string;
  user_ratings_total: number;
  business_status: string;
  opening_hours?: {
    open_now: boolean;
  };
  photos?: any[];
  geometry?: any;
  types: string[];
  website?: string;
  url?: string;
  reviews?: any[];
  price_level?: number;
  icon?: string;
  icon_background_color?: string;
  icon_mask_base_uri?: string;
}