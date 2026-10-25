import { z } from "zod";

const phone = z
  .string()
  .trim()
  .regex(/^((\+?88)?01[3-9]\d{8})?$/, "Use a Bangladeshi number like 01712345678");

// Mirrors the backend admin rules so errors show before the request is sent.
export const createUserSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().trim().min(1, "Email is required").email("Enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Za-z]/, "Password must contain at least one letter")
    .regex(/\d/, "Password must contain at least one number"),
  role: z.enum(["STUDENT", "TEACHER", "ADMIN"]),
  phone,
});
export type CreateUserInput = z.infer<typeof createUserSchema>;

export const createInvoiceSchema = z.object({
  studentId: z.string().min(1, "Select a student"),
  title: z.string().trim().min(3, "Title must be at least 3 characters").max(150),
  semester: z.string().trim().refine((value) => value === "" || (value.length >= 3 && value.length <= 30), "Semester must be 3-30 characters"),
  amount: z
    .string()
    .trim()
    .regex(/^\d+(\.\d{1,2})?$/, "Enter an amount like 45000 or 45000.50")
    .refine((value) => Number(value) > 0, "Amount must be greater than 0"),
  dueDate: z.string(),
});
export type CreateInvoiceInput = z.infer<typeof createInvoiceSchema>;

export const offeringSchema = z.object({
  courseId: z.string().min(1, "Select a course"),
  teacherId: z.string().min(1, "Select a teacher"),
  semester: z.string().trim().min(3, "Semester must be at least 3 characters").max(30, "Semester must be at most 30 characters"),
  section: z.string().trim().min(1, "Section is required").max(5, "Section must be at most 5 characters"),
  capacity: z
    .string()
    .trim()
    .regex(/^\d+$/, "Capacity must be a whole number")
    .refine((value) => Number(value) >= 1 && Number(value) <= 500, "Capacity must be between 1 and 500"),
});
export type OfferingInput = z.infer<typeof offeringSchema>;
