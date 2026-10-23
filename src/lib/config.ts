export const BACKEND_URL = process.env.BACKEND_URL ?? "";

if (!BACKEND_URL && process.env.NODE_ENV !== "test") {
  console.warn("BACKEND_URL is not set. Add it to .env.local");
}

export const APP_NAME = "UniManage";