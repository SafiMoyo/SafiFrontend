export enum ENUM_LESSON_STATUS {
  ONGOING = "ONGOING",
  NOT_STARTED = "NOT_STARTED",
  COMPLETED = "COMPLETED",
}

export type LessonsType = {
  id: number
  status: ENUM_LESSON_STATUS
  lesson_title: string
  lesson_duration: string
  lesson_description: string
  module_id: string
  serial_number: number
  video_url: string
  cover_image_url: string
  completion_rate: number
}
