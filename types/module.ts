import { SubscriptionStatus } from "./subscription"

export type ModuleType = {
  module_progress: number
  id: string
  module_title: string
  module_description: string
  no_of_lessons: number
  sequence_num: number
  cover_image_url: string
  module_tier: SubscriptionStatus
}
