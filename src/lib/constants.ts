import type { Role } from "@/types/api";

export const ROLE_HOME: Record<Role, string> = {
  ADMIN: "/admin",
  TEACHER: "/teacher",
  STUDENT: "/student",
};

export const ROLE_LABEL: Record<Role, string> = {
  ADMIN: "Administrator",
  TEACHER: "Teacher",
  STUDENT: "Student",
};

// Route prefix -> the only role allowed to open it.
export const ROLE_PREFIX: Record<string, Role> = {
  "/admin": "ADMIN",
  "/teacher": "TEACHER",
  "/student": "STUDENT",
};

export const DEMO_ACCOUNTS: { role: Role; email: string; password: string; blurb: string }[] = [
  { role: "ADMIN", email: "admin@ums.test", password: "Admin@12345", blurb: "Users, academics, fees, audit logs" },
  { role: "TEACHER", email: "teacher@ums.test", password: "Teacher@12345", blurb: "Classes, attendance, results" },
  { role: "STUDENT", email: "student@ums.test", password: "Student@12345", blurb: "Courses, fees, results, GPA" },
];