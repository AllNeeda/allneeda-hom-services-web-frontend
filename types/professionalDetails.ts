// types/professional.ts
export interface BusinessHour {
  day: number;
  start_time: string;
  end_time: string;
  status: 'open' | 'closed';
  _id: string;
}

export interface ProfessionalData {
  _id: string;
  user_id: string;
  business_name: string;
  business_type: 'individual' | 'company';
  introduction: string;
  employees: number;
  founded_year: number;
  rating_avg: number;
  total_review: number;
  total_hire: number;
  profile_image: string;
  business_hours: BusinessHour[];
  payment_methods: string[];
  specializations: string[];
  portfolio: string[];
  website: string;
  timezone: string;
  is_available: boolean;
  last_seen: string;
  credit_balance: number;
  visibility_settings: {
    expected_response_time: boolean;
    last_hire: boolean;
    last_seen: boolean;
    total_hire: boolean;
  };
}