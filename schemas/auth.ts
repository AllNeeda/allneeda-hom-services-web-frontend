import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email"),
  password: z.string().min(8, "Minimum 8 characters")
    .regex(/[a-z]/, "Include lowercase")
    .regex(/[A-Z]/, "Include uppercase")
    .regex(/[0-9]/, "Include number")
    .regex(/[^a-zA-Z0-9]/, "Include special character"),
});

export const registerSchema = loginSchema.extend({
  username: z.string().min(3, "Username must be at least 3 characters"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
  path: ['confirmPassword'],
  message: "Passwords do not match",
});
