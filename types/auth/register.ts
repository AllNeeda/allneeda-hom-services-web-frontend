export interface RegisterFormData {
  businessName: string;
  country: string;
  streetAddress: string;
  city: string;
  region: string;
  postalCode: string;
  website?: string;
  username: string;
  terms:boolean;
  email: string;
  phone: string;
  password: string;
  repassword: string;
  subCategories: string[];
  categories: string[];
  services_id: string[];
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  professional?: {
    id: string;
    username: string;
  };
}
