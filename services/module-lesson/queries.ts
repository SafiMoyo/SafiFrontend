import { createQuery } from "../api/queries"
import {
  CheckEnrolledRes,
  DashboardStatisticsRes,
  GetModuleLessonsRes,
  GetModulesRes,
} from "./types"

export const keyPlans = ["user-plans"]
export const keyModules = ["user-modules"]
export const keyDashboardStats = ["dashboard-statistics"]

export const useQueryModules = createQuery<GetModulesRes>({
  key: keyModules,
  url: "/user/modules",
})

export const useQueryCheckEnrolled = createQuery<CheckEnrolledRes>({
  key: ["check-enrolled"],
  url: "/user/module/check-enrolled",
})

export const useQueryModuleLessons = createQuery<GetModuleLessonsRes>({
  key: ["module-lessons"],
  url: "/user/module-lessons",
})

export const useQueryDashboardStatistics = createQuery<DashboardStatisticsRes>({
  key: keyDashboardStats,
  url: "/user/dashboard-statistics",
})
