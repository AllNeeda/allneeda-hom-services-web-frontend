// Service Type
export type ServiceType = {
  _id: string;
  name: string;
  slug: string;
  subcategory_id: string;
  is_active: boolean;
  is_featured:boolean;
  image_url: string;
  image_file: File | null;
  description: string;
}

// Subcategory Type (basic)
export type SubcategoryType = {
  _id?: string; // Make optional for new items
  name: string;
  slug: string;
  subcategory_image_url: string;
  subcategory_image_file: File | null; // Allow null
  category_id?: string;
  is_active?: boolean;
  description?: string;
}

// Subcategory with Services Type
export type SubcategoryWithServicesType = {
  _id: string;
  name: string;
  slug: string;
  subcategory_image_url: string;
  services: ServiceType[];
  services_count: number;
}