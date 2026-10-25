# UniManage: University Management System (Frontend)

A role-based university portal built with the Next.js App Router. Students enroll in courses, follow attendance, read results and CGPA, and pay fees online. Teachers take attendance and publish results. Admins manage users, academics and invoices from an analytics dashboard.

| | |
|---|---|
| Live site | https://l2-ph-assignment-07.vercel.app |
| Backend API | https://l2ph-assignment-06.onrender.com/api/v1 |
| API docs (Swagger) | https://l2ph-assignment-06.onrender.com/api/v1/docs |
| Backend repository | https://github.com/mohiuddin-swe/L2PH-Assignment-06 |

> The backend runs on a free Render plan that sleeps when idle. The first request after a quiet period can take up to a minute.

## Demo accounts

The sign-in page has one-click demo buttons for each role.

| Role | Email | Password |
|---|---|---|
| Admin | admin@ums.test | Admin@12345 |
| Teacher | teacher@ums.test | Teacher@12345 |
| Student | student@ums.test | Student@12345 |

### Testing the payment flow (SSLCommerz sandbox)

1. Sign in as admin, open **Invoices**, and create an invoice for a student (semester must match the offering, for example `Fall 2026`).
2. Sign in as that student, open **Invoices**, and press **Pay now**.
3. On the gateway choose Visa: card `4111 1111 1111 1111`, CVV `111`, expiry `12/30`, OTP `111111`.
4. You return to the app and the invoice shows as **Paid**. No real money moves.

## Features

**Student**: dashboard with CGPA, credits, attendance and notices; course browsing and enrollment (seat limits, 18-credit cap, unpaid-invoice check); drop course; attendance with a 75% warning; results with semester GPA chart; invoices and real online payment; payment history; profile edit; notices.

**Teacher**: dashboard; assigned classes; per-class workspace with student roster, bulk attendance marking (editable for past days), marks entry with validation, draft-then-publish results; notices (create, edit, delete).

**Admin**: Recharts dashboard (users by role, invoices by status, popular offerings); user management (create, search, filter, suspend); academics (offerings, courses, departments); a three-step Create Offering wizard; invoices (create, cancel); notices; audit logs.

**Public**: landing, features, about, FAQ and contact pages with SEO metadata.

## Tech stack

- **Next.js 16** (App Router, Server Components by default, `loading`, `error` and `not-found` files, `proxy.ts` route protection)
- **TypeScript** in strict mode, no `any`
- **Tailwind CSS 4** and **shadcn/ui** (Base UI), light and dark theme
- **TanStack Query** for client data, **Zustand** for the signed-in user
- **React Hook Form** with **Zod**, mapping backend validation errors onto form fields
- **Recharts** for charts, **Sonner** for toasts, `next/image` for images

## Architecture notes

- **Tokens never reach the browser.** Access and refresh tokens live in httpOnly cookies. The browser talks to the Next.js server (`/api/auth/*` and `/api/proxy/*`), which forwards requests to the backend. Server Components call the backend directly with the cookie.
- **Route protection.** `src/proxy.ts` keeps the session fresh (single-flight refresh, because the backend rotates refresh tokens) and keeps each role inside `/admin`, `/teacher` or `/student`. Role-based navigation is derived from the server-loaded user.
- **URL state.** Lists keep page, search, sort and filters in the URL through `useListParams`, so a filtered table survives a refresh and can be shared.
- **Payment.** The browser asks the backend to initiate a payment and is redirected to the SSLCommerz hosted page. The backend verifies the result and redirects back to `/payment/success`, `/payment/fail` or `/payment/cancel`, where the app polls until the payment is confirmed.

## Run locally

```bash
git clone https://github.com/mohiuddin-swe/L2PH-Assignment-07.git
cd L2PH-Assignment-07
npm install
# then create .env.local with the line below
```

`.env.local`:

```
BACKEND_URL=https://l2ph-assignment-06.onrender.com/api/v1
```

```bash
npm run dev        # http://localhost:3000
npm run typecheck  # strict TypeScript check
npm run build      # production build
```

To test payments locally, the backend's `FRONTEND_URL` must be `http://localhost:3000`.

## Deployment

Deployed on Vercel with one environment variable, `BACKEND_URL`. The backend's `FRONTEND_URL` and `CORS_ORIGINS` must contain the Vercel URL.
