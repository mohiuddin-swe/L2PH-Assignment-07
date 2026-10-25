import { z } from "zod";

// Mirrors the backend notice rules.
export const noticeSchema = z.object({
  title: z.string().trim().min(3, "Title must be at least 3 characters").max(150, "Title must be at most 150 characters"),
  content: z.string().trim().min(1, "Content is required").max(5000, "Content must be at most 5000 characters"),
});

export type NoticeInput = z.infer<typeof noticeSchema>;