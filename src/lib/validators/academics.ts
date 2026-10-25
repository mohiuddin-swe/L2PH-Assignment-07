import { z } from "zod";

// Mirrors the backend department and course rules.
export const departmentSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100, "Name must be at most 100 characters"),
  code: z.string().trim().regex(/^[A-Za-z0-9]{2,10}$/, "Code must be 2-10 letters or digits"),
});
export type DepartmentInput = z.infer<typeof departmentSchema>;

export const courseSchema = z.object({
  code: z.string().trim().regex(/^[A-Za-z0-9-]{3,15}$/, "Code must be 3-15 characters (letters, digits, hyphen)"),
  title: z.string().trim().min(3, "Title must be at least 3 characters").max(150, "Title must be at most 150 characters"),
  description: z.string().trim().max(1000, "Description must be at most 1000 characters"),
  credit: z.string().regex(/^[1-6]$/, "Credit must be between 1 and 6"),
  departmentId: z.string().min(1, "Select a department"),
});
export type CourseInput = z.infer<typeof courseSchema>;
