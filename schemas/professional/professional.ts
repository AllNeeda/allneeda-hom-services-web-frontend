import z from "zod";

export const professionalSchema = z.object({
  introduction: z
    .string()
    .min(100, "Introduction must be at least 100 characters")
    .max(500, "Introduction must be less than 500 characters"),
});

export type ProfessionalFormData = z.infer<typeof professionalSchema>;

// schemas/professional/professional.ts
export const ProfessionalStepOne = z.object({
  // Business Information
  businessName: z.string().min(1, "Business name is required"),
  businessType: z.string().min(1, "Business type is required"),
  categories: z.array(z.string()).min(1, "Please select at least one category"),
  subCategories: z.array(z.string()).min(1, "Please select at least one sub-category"),
  services_id: z.array(z.string()).min(1, "Please select at least one service"),
  country: z.string().default("United States"),
  streetAddress: z.string().min(1, "Street address is required"),
  city: z.string().min(1, "City is required"),
  region: z.string().min(1, "State/Province is required"),
  postalCode: z.string().min(1, "Postal code is required"),
  website: z.string().optional(),
  
  // Personal Information
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  username: z.string().min(1, "Username is required"),
  email: z.string().email("Valid email is required").optional().or(z.literal('')),
  phoneNo: z.string().min(1, "Phone number is required"),
  
  // Terms
  terms: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and conditions",
  }),
});

export type ProfessionalStepOneSchemaType = z.infer<typeof ProfessionalStepOne>;