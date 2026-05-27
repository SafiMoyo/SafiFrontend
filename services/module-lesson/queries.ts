import qs from "query-string"
import { createQuery } from "../api/queries"
import { createApiRequest } from "../api/createRequest"
import {
  CanWatchRes,
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

/**
 * Reactive hook — used on the lesson page to gate the video player.
 * The key is a function so that queryParams (lesson_id + module_id)
 * are baked into the cache key, giving each lesson its own cache entry.
 */
export const useQueryCanWatch = createQuery<CanWatchRes>({
  key: (params) => ["can-watch-lesson", params],
  url: "/user/lessons/can-watch",
})

/**
 * Imperative helper — call directly (no hook) when you need an
 * on-demand access check, e.g. before navigating to the next lesson.
 */
export async function fetchCanWatch(
  lessonId: string | number,
  moduleId: string
): Promise<CanWatchRes> {
  return createApiRequest<CanWatchRes>({
    url: "/user/lessons/can-watch",
    queryParams: qs.stringify({
      lesson_id: String(lessonId),
      module_id: moduleId,
    }),
    method: "GET",
  })
}
