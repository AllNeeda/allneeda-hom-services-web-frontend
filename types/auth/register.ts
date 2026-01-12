export interface RegisterFormData {
  businessName: string;
  country: string;
  streetAddress: string;
  city: string;
  region: string;
  postalCode: string;
  website?: string;
  terms: boolean;
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

export interface OTPRegisterData {
  // Business Information
  businessName: string;
  businessType: string;
  categories: string[];
  subCategories: string[];
  services_id: string[];
  country: string;
  streetAddress: string;
  city: string;
  region: string;
  postalCode: string;
  website?: string;

  // Personal Information
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  email?: string;
  phoneNo: string;
  terms: boolean;

  // Set after createUser
  user_id?: string;
}

export interface OTPResponse {
  success: boolean;
  message: string;
  data?: {
    expiresAt?: string;
    tempId?: string;
  };
}

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  phoneNo: string;
  email?: string;
  ReferralCode?: string;
  dob?: string;
  businessType: string;
  isAgreeTermsConditions?: boolean;
  role_id?: string;
  status?: boolean;
  Islogin_permissions?: boolean;
  Permissions_DeviceLocation?: boolean;
  hobby?: any[];
  RegistrationType?: string;
  invitedBy?: string | null;
  created_by?: string | null;
  updated_by?: string | null;
  created_at?: string;
  updated_at?: string;
  user_id?: string | null;
  freeTrialPlan?: boolean;
  language_id?: string | null;
  country_id?: string | null;
  state_id?: string | null;
  city_id?: string | null;
}

export interface LoginResponse {
  user: User;
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}
