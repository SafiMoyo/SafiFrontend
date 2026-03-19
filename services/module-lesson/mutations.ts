import { createMutation } from "../api/mutation"

import { keyDashboardStats, keyModules } from "./queries"

export const useMutateEnrolModule = createMutation({
  url: "/user/module/enrol",
  method: "POST",
  keysToRefetch: [keyModules],
})

export const useMutateRecordLesson = createMutation({
  url: "/user/progress/record/lesson",
  method: "POST",
  keysToRefetch: [keyDashboardStats],
})
