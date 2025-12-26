import * as z from 'zod';

// Phone number validation - accepts international format with or without +, spaces, dashes, parentheses
const phoneRegex = /^[+]?\(?[0-9]{1,4}\)?[-\s.]?\(?[0-9]{1,4}\)?[-\s.]?[0-9]{1,9}$/;

export const phoneLoginSchema = z.object({
  phone: z.string()
    .min(10, "Phone number must be at least 10 digits")
    .max(20, "Phone number is too long")
    .regex(phoneRegex, "Please enter a valid phone number"),
  otp: z.string()
    .length(6, "OTP must be exactly 6 digits")
    .regex(/^\d+$/, "OTP must contain only numbers"),
});

export type PhoneLoginFormData = z.infer<typeof phoneLoginSchema>;