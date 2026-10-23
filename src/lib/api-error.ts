import type { FieldError } from "@/types/api";

export class ApiError extends Error {
  status: number;
  errors: FieldError[];

  constructor(message: string, status = 500, errors: FieldError[] = []) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errors = errors;
  }
}