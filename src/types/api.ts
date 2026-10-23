// Types mirror the real responses of the UMS backend (verified against the live API).

export type Role = "ADMIN" | "TEACHER" | "STUDENT";
export type UserStatus = "ACTIVE" | "SUSPENDED";
export type EnrollmentStatus = "ENROLLED" | "DROPPED";
export type AttendanceStatus = "PRESENT" | "ABSENT" | "LATE";
export type ResultStatus = "DRAFT" | "PUBLISHED";
export type InvoiceStatus = "UNPAID" | "PAID" | "CANCELLED";
export type PaymentStatus = "PENDING" | "SUCCESS" | "FAILED" | "CANCELLED";
export type PaymentGateway = "STRIPE" | "SSLCOMMERZ";

/* ---------- Envelope ---------- */

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface FieldError {
  field: string;
  message: string;
}

export interface ApiSuccess<T> {
  success: true;
  message: string;
  data: T;
  meta?: PaginationMeta;
}

export interface ApiFailure {
  success: false;
  message: string;
  errors?: FieldError[];
}

export type ApiEnvelope<T> = ApiSuccess<T> | ApiFailure;

export interface Paginated<T> {
  data: T[];
  meta: PaginationMeta;
}

/* ---------- Auth / users ---------- */

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: Role;
  status: UserStatus;
}

export interface AuthResult extends TokenPair {
  user: AuthUser;
}

export interface DepartmentRef {
  id: string;
  name: string;
  code: string;
}

export interface Profile extends AuthUser {
  authProvider: "LOCAL" | "GOOGLE";
  createdAt: string;
  studentProfile: { studentId: string; department?: DepartmentRef | null } | null;
  teacherProfile: { designation?: string | null; department?: DepartmentRef | null } | null;
}

export interface AdminUser extends Profile {
  updatedAt: string;
}

/* ---------- Academics ---------- */

export interface Department {
  id: string;
  name: string;
  code: string;
  createdAt: string;
  updatedAt: string;
  _count: { courses: number };
}

export interface Course {
  id: string;
  code: string;
  title: string;
  description: string | null;
  credit: number;
  departmentId: string;
  createdAt: string;
  updatedAt: string;
  department: DepartmentRef;
}

export interface Offering {
  id: string;
  semester: string;
  section: string;
  capacity: number;
  enrolledCount: number;
  createdAt: string;
  updatedAt: string;
  course: { id: string; code: string; title: string; credit: number };
  teacher: { id: string; name: string; email: string };
  availableSeats: number;
}

export interface ClassListItem {
  id: string; // enrollmentId
  status: EnrollmentStatus;
  createdAt: string;
  student: { id: string; name: string; email: string; studentProfile: { studentId: string } | null };
}

export interface MyEnrollment {
  id: string;
  status: EnrollmentStatus;
  createdAt: string;
  updatedAt: string;
  offering: {
    id: string;
    semester: string;
    section: string;
    course: { id: string; code: string; title: string; credit: number };
    teacher: { id: string; name: string };
  };
}

/* ---------- Attendance / results ---------- */

export interface OfferingAttendanceRecord {
  id: string;
  date: string;
  status: AttendanceStatus;
  enrollmentId: string;
  student: { id: string; name: string; email: string };
}

export interface MyAttendance {
  enrollmentId: string;
  offering: { id: string; semester: string; section: string; course: { code: string; title: string } };
  summary: { totalClasses: number; present: number; late: number; absent: number; percentage: number };
  records: { date: string; status: AttendanceStatus }[];
}

export interface OfferingResult {
  id: string;
  marks: number;
  grade: string | null;
  gradePoint: number | null;
  status: ResultStatus;
  publishedAt: string | null;
  enrollment: { id: string; student: { id: string; name: string; email: string } };
}

export interface MyResults {
  results: {
    offeringId: string;
    semester: string;
    section: string;
    course: { code: string; title: string; credit: number };
    marks: number;
    grade: string;
    gradePoint: number;
    publishedAt: string;
  }[];
  semesters: { semester: string; gpa: number; totalCredits: number }[];
  cgpa: number;
  totalCredits: number;
}

/* ---------- Finance ---------- */

export interface Payment {
  id: string;
  invoiceId: string;
  gateway: PaymentGateway;
  transactionId: string | null;
  amount: string;
  currency: string;
  status: PaymentStatus;
  paidAt: string | null;
  createdAt: string;
  invoice: { id: string; title: string; semester: string | null };
  user?: { id: string; name: string; email: string };
}

export interface InvoicePayment {
  id: string;
  gateway: PaymentGateway;
  transactionId: string | null;
  amount: string;
  status: PaymentStatus;
  paidAt: string | null;
  createdAt: string;
}

export interface Invoice {
  id: string;
  title: string;
  semester: string | null;
  amount: string;
  currency: string;
  status: InvoiceStatus;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
  student?: { id: string; name: string; email: string };
  payments?: InvoicePayment[];
}

export interface InitiatedPayment {
  gatewayUrl: string;
  [key: string]: unknown;
}

/* ---------- Notices / admin ---------- */

export interface Notice {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  author: { id: string; name: string; role: Role };
}

export interface AuditLog {
  id: string;
  action: string;
  entity: string;
  entityId: string | null;
  before: unknown;
  after: unknown;
  ip: string | null;
  createdAt: string;
  actor: { id: string; name: string; email: string; role: Role } | null;
}

export interface MoneyBucket {
  count: number;
  amount: string;
}

export interface AdminStats {
  users: {
    total: number;
    byRole: Record<Role, number>;
    suspended: number;
    joinedLast7Days: number;
  };
  academics: {
    departments: number;
    courses: number;
    offerings: number;
    activeEnrollments: number;
    totalSeats: number;
    filledSeats: number;
    seatUtilizationPercent: number;
  };
  finance: {
    revenue: string;
    successfulPayments: number;
    pendingPayments: number;
    invoices: Partial<Record<InvoiceStatus, MoneyBucket>>;
  };
  topOfferings: {
    id: string;
    semester: string;
    section: string;
    capacity: number;
    enrolledCount: number;
    course: { code: string; title: string };
  }[];
}