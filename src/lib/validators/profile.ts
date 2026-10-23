import { z } from "zod";

// Mirrors the backend updateMe rules: only name and phone can be edited.
export const profileSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100, "Name must be at most 100 characters"),
  phone: z
    .string()
    .trim()
    .regex(/^((\+?88)?01[3-9]\d{8})?$/, "Use a Bangladeshi number like 01712345678"),
});

export type ProfileInput = z.infer<typeof profileSchema>;