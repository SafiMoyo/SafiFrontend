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
