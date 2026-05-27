import { LessonsType } from "@/types/lesson"
import { ModuleType } from "@/types/module"

export type BadgeItem = {
  id: number
  name: string
  description: string
  image_url: string | null
  module_id: string
  earned_at: string
}

export type DashboardStatisticsRes = {
  data: {
    lessons_done: number
    modules_completed: number
    badges_earned: number
    overall_progress: {
      total_lessons: number
      ongoing_lessons: number
    }
    day_streak: number
    last_active: string
    age_group: string
    average_session: string
    badges: BadgeItem[]
    module_breakdown: {
      progress: string
      module_id: string
      module_title: string
    }[]
    weekly_activity: {
      Monday: number
      Tuesday: number
      Wednesday: number
      Thursday: number
      Friday: number
      Saturday: number
      Sunday: number
    }
  }
}

export type GetModulesRes = {
  data: ModuleType[]
}

export type GetModuleLessonsRes = {
  data: LessonsType[]
}

export type CheckEnrolledRes = {
  data: {
    enrolled: boolean
  }
}

export type CanWatchRes = {
  status: boolean
  message: string
  data: {
    canWatch: boolean
    reason?: string
  }
}

export type UpgradePlanPayload = {
  plan_id: number
  billing_cycle: "monthly" | "yearly"
}

export type UpgradePlanRes = {
  data: {
    authorization_url: string
    access_code: string
    reference: string
  }
}
