import { useQuery } from "@tanstack/react-query"
import adminAxios from "./adminInstance"

export type DashboardOverview = {
  total_students: number
  total_partners: number
  total_lessons: number
  total_completed_lessons: number
  total_modules: number
  early_modules: number
  middle_modules: number
  advanced_modules: number
}

export type MonthlyActivity = {
  month: number
  month_label: string
  active_users: number
}

export type MonthlyFinancial = {
  month: number
  month_label: string
  total_revenue: number
  courses_sold: number
}

export type TopLesson = {
  lesson_id: number
  lesson_title: string
  module_title: string
  module_id: string
  view_count: number
}

export const useAdminDashboardOverview = () =>
  useQuery<{ data: DashboardOverview }>({
    queryKey: ["admin-overview"],
    queryFn: () =>
      adminAxios.get("/admin/dashboard-overview").then((r) => r.data),
  })

export const useAdminUserActivity = (year: number) =>
  useQuery<{ data: { year: number; monthly_active_users: MonthlyActivity[] } }>({
    queryKey: ["admin-user-activity", year],
    queryFn: () =>
      adminAxios
        .get("/admin/user-activity", { params: { year } })
        .then((r) => r.data),
  })

export const useAdminTopLessons = () =>
  useQuery<{ data: TopLesson[] }>({
    queryKey: ["admin-top-lessons"],
    queryFn: () =>
      adminAxios.get("/admin/lessons/top-performing").then((r) => r.data),
  })

export const useAdminFinancialAnalysis = (year: number) =>
  useQuery<{ data: { year: number; monthly_data: MonthlyFinancial[] } }>({
    queryKey: ["admin-financial", year],
    queryFn: () =>
      adminAxios
        .get("/admin/financial-analysis", { params: { year } })
        .then((r) => r.data),
  })

// ── Transactions ──────────────────────────────────────────────────────────────

export type TransactionOverview = {
  total_transactions: number
  total_revenue: number
  successful_transactions: number
  pending_transactions: number
  failed_transactions: number
}

export type Transaction = {
  transaction_id: number
  user_name: string
  email: string
  plan_name: string
  amount: number
  status: string
  date: string
  reference: string
}

export type TransactionPage = {
  content: Transaction[]
  page: number
  size: number
  total_elements: number
  total_pages: number
}

export const useAdminTransactionOverview = () =>
  useQuery<{ data: TransactionOverview }>({
    queryKey: ["admin-tx-overview"],
    queryFn: () =>
      adminAxios.get("/admin/transactions/overview").then((r) => r.data),
  })

export const useAdminTransactions = (page: number, size = 10) =>
  useQuery<{ data: TransactionPage }>({
    queryKey: ["admin-transactions", page, size],
    queryFn: () =>
      adminAxios
        .get("/admin/transactions", { params: { page, size } })
        .then((r) => r.data),
  })

export const useAdminTransactionsFilter = (
  status: string | null,
  date: string | null,
  page: number,
  size = 10
) =>
  useQuery<{ data: TransactionPage }>({
    queryKey: ["admin-transactions-filter", status, date, page, size],
    queryFn: () =>
      adminAxios
        .get("/admin/transactions/filter", {
          params: {
            ...(status ? { status } : {}),
            ...(date ? { date } : {}),
            page,
            size,
          },
        })
        .then((r) => r.data),
    enabled: !!(status || date),
  })

// ── Users ─────────────────────────────────────────────────────────────────────

export type UsersOverview = {
  total_students: number
  active_students: number
  inactive_students: number
  new_students: number
}

export type AdminUser = {
  user_id: number
  first_name: string
  last_name: string
  email: string
  age_group: string
  registered_at: string
  subscription_status: string
  profile_picture?: string
}

export type AdminUserPage = {
  content: AdminUser[]
  page: number
  size: number
  total_elements: number
  total_pages: number
}

export type Enrollment = {
  module_id: string
  module_title: string
  progress_percentage: number
}

export type ActivityLogEntry = {
  event_type: string
  description: string
  timestamp: string
}

export type PaginatedActivityLog = {
  content: ActivityLogEntry[]
  page: number
  size: number
  total_elements: number
  total_pages: number
}

export type AdminUserDetail = {
  user_id: number
  first_name: string
  last_name: string
  email: string
  age_group: string
  registered_at: string
  last_login_at: string
  subscription_status: string
  subscription_plan?: string
  subscription_end_date?: string
  account_status?: string
  is_active?: boolean
  status?: string
  profile_picture?: string
  current_enrollments: Enrollment[]
  completed_modules: Enrollment[]
  activity_log: PaginatedActivityLog
}

export type AuditLogEntry = {
  id: number
  admin_name: string
  action_type: string
  title: string
  message: string
  performed_at: string
}

export type AuditLogPage = {
  content: AuditLogEntry[]
  page: number
  size: number
  total_elements: number
  total_pages: number
}

export const useAdminUsersOverview = () =>
  useQuery<{ data: UsersOverview }>({
    queryKey: ["admin-users-overview"],
    queryFn: () =>
      adminAxios.get("/admin/users/overview").then((r) => r.data),
  })

export const useAdminAllUsers = (page: number, size = 10, status?: string) =>
  useQuery<{ data: AdminUserPage }>({
    queryKey: ["admin-all-users", page, size, status],
    queryFn: () =>
      adminAxios
        .get("/admin/all-users", { params: { page, size, ...(status ? { status } : {}) } })
        .then((r) => r.data),
  })

export const useAdminUserDetail = (
  userId: number,
  logPage = 0,
  logSize = 5,
) =>
  useQuery<{ data: AdminUserDetail }>({
    queryKey: ["admin-user-detail", userId, logPage, logSize],
    queryFn: () =>
      adminAxios
        .get(`/admin/users/${userId}`, { params: { log_page: logPage, log_size: logSize } })
        .then((r) => r.data),
    enabled: !!userId,
  })

export const useAdminAuditLogs = (page: number, size = 20) =>
  useQuery<{ data: AuditLogPage }>({
    queryKey: ["admin-audit-logs", page, size],
    queryFn: () =>
      adminAxios
        .get("/admin/audit-trail", { params: { page, size } })
        .then((r) => r.data),
  })

// ── Enquiries ─────────────────────────────────────────────────────────────────

export type Enquiry = {
  id: number
  name: string
  email: string
  message: string
  created_at: string
}

export type EnquiryPage = {
  content: Enquiry[]
  page: number
  size: number
  total_elements: number
  total_pages: number
}

export const useAdminEnquiries = (page: number, size = 20) =>
  useQuery<{ data: EnquiryPage }>({
    queryKey: ["admin-enquiries", page, size],
    queryFn: () =>
      adminAxios
        .get("/admin/support-enquiries", { params: { page, size } })
        .then((r) => r.data),
  })

// ── Partners ──────────────────────────────────────────────────────────────────

export type AdminPartner = {
  id: number
  first_name: string
  last_name: string
  email?: string
  phone_number?: string
  business_name?: string
  status?: string
  account_status?: string
  created_at?: string
  registered_at?: string
  profile_picture?: string
  referral_code?: string
  total_referrals?: number
}

export type AdminPartnerPage = {
  content: AdminPartner[]
  page: number
  size: number
  total_elements: number
  total_pages: number
}

export const useAdminPartners = (page: number, size = 10) =>
  useQuery<{ data: AdminPartnerPage }>({
    queryKey: ["admin-partners", page, size],
    queryFn: () =>
      adminAxios
        .get("/admin/partners", { params: { page, size } })
        .then((r) => r.data),
  })

export type AdminPartnerDetail = {
  id: number
  email: string
  first_name: string
  last_name: string
  organization_name?: string
  referral_code?: string
  total_signups: number
  paid_customers: number
  total_commission_earned: number
  pending_payout: number
  total_paid_out: number
  created_at: string
  last_payout_date?: string | null
  bank_account?: {
    account_name: string
    account_number: string
    bank_name: string
  }
}

export const useAdminPartnerDetail = (partnerId: number) =>
  useQuery<{ status: boolean; message: string; data: AdminPartnerDetail }>({
    queryKey: ["admin-partner-detail", partnerId],
    queryFn: () => adminAxios.get(`/admin/partners/${partnerId}`).then((r) => r.data),
    enabled: !!partnerId,
  })

// ── Subscription Plans ────────────────────────────────────────────────────────

export type SubscriptionBenefit = {
  id: number
  benefit: string
}

export type SubscriptionPlan = {
  id: number
  amount: number
  discount: number
  duration: string
  plan_type: string
  subscription_benefits: SubscriptionBenefit[]
}

export const useAdminSubscriptionPlans = () =>
  useQuery<{ status: boolean; message: string; data: SubscriptionPlan[] }>({
    queryKey: ["admin-subscription-plans"],
    queryFn: () => adminAxios.get("/admin/subscription-plans").then((r) => r.data),
  })

// ── Commission Rate ───────────────────────────────────────────────────────────

export type CommissionRate = {
  id: number
  rate: number
  updated_at: string
}

export const useAdminCommissionRate = () =>
  useQuery<{ status: boolean; message: string; data: CommissionRate }>({
    queryKey: ["admin-commission-rate"],
    queryFn: () => adminAxios.get("/admin/commission-rate").then((r) => r.data),
  })

// ── Modules ───────────────────────────────────────────────────────────────────

export type AdminModule = {
  id: string
  module_title: string
  module_description?: string
  cover_image_url?: string
  module_tier?: string
  age_group?: string
  no_of_lessons?: number
  sequence_num?: number
}

export type DraftLesson = {
  id: number
  lesson_title: string
  publish_status: string
  lesson_duration?: string
  lesson_description?: string
  cover_image_url?: string
  serial_number?: number
}

export type DraftModule = {
  id: string
  module_title: string
  module_description?: string
  cover_image_url?: string
  module_tier?: string
  age_group?: string
  lessons: DraftLesson[]
}

export type PublishedModulesResponse =
  | { data: AdminModule[] }
  | { data: { early?: AdminModule[]; middle?: AdminModule[]; advanced?: AdminModule[]; unassigned?: AdminModule[] } }

export const useAdminPublishedModules = () =>
  useQuery<PublishedModulesResponse>({
    queryKey: ["admin-published-modules"],
    queryFn: () => adminAxios.get("/admin/modules").then((r) => r.data),
  })

export const useAdminUnpublishedModules = () =>
  useQuery<{ data: DraftModule[] }>({
    queryKey: ["admin-unpublished-modules"],
    queryFn: () => adminAxios.get("/admin/modules/unpublished").then((r) => r.data),
  })

export type AdminLesson = {
  id: number
  lesson_title: string
  lesson_duration: string
  lesson_description: string
  module_id: string
  serial_number: number
  video_url?: string
  cover_image_url?: string
  publish_status?: string
}

export const useAdminModuleLessons = (moduleId: string) =>
  useQuery<{ data: AdminLesson[] }>({
    queryKey: ["admin-module-lessons", moduleId],
    queryFn: () => adminAxios.get(`/admin/modules/${moduleId}/lessons`).then((r) => r.data),
    enabled: !!moduleId,
  })
