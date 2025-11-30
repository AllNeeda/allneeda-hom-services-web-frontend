import z from "zod";

export const professionalSchema = z.object({
  introduction: z
    .string()
    .min(100, "Introduction must be at least 100 characters")
    .max(500, "Introduction must be less than 500 characters"),
});

export type ProfessionalFormData = z.infer<typeof professionalSchema>;

export const ProfessionalStepOne = z
  .object({
    username: z.string().min(3, "Business name must be at least 3 characters"),
    businessType: z.string().nonempty("Please select a business type"),
    country: z.string().min(2, "Please select a country"),
    streetAddress: z.string().min(3, "Street address is required"),
    city: z.string().min(2, "City is required"),
    region: z.string().min(2, "State/Province is required"),
    postalCode: z.string().min(3, "Postal code is required"),
    firstName: z.string().min(2, "First name is required"),
    website: z.string(),
    lastName: z.string().min(2, "Last name is required"),
    email: z.string().min(2, "Email is required").email("Enter a valid email"),
    phone: z.string().min(10, "Phone number must be at least 10 digits"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    repassword: z.string().min(8, "Please re-enter your password"),
    categories: z
      .array(z.string())
      .min(1, "Please select at least one category"),
    subCategories: z
      .array(z.string())
      .min(1, "Please select at least one subcategory"),
    services_id: z
      .array(z.string())
      .min(1, "Please select at least one service"),
  })
  .refine((data) => data.password === data.repassword, {
    message: "Passwords do not match",
    path: ["repassword"],
  });

export type ProfessionalStepOneSchemaType = z.infer<typeof ProfessionalStepOne>;
