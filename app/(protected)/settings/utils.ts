export type ProfileForm = {
  firstName: string
  lastName: string
  email: string
  ageGroup: string
  avatarPreview: string | null
}

export type WeekDayItem = {
  key: string
  label: string
  value: number
}

export const dayLabelMap: Record<string, string> = {
  Monday: "MON",
  Tuesday: "TUE",
  Wednesday: "WED",
  Thursday: "THU",
  Friday: "FRI",
  Saturday: "SAT",
  Sunday: "SUN",
}

export const progressWidthSteps = [
  "w-0",
  "w-[5%]",
  "w-[10%]",
  "w-[15%]",
  "w-[20%]",
  "w-[25%]",
  "w-[30%]",
  "w-[35%]",
  "w-[40%]",
  "w-[45%]",
  "w-[50%]",
  "w-[55%]",
  "w-[60%]",
  "w-[65%]",
  "w-[70%]",
  "w-[75%]",
  "w-[80%]",
  "w-[85%]",
  "w-[90%]",
  "w-[95%]",
  "w-full",
]

export const activityHeightSteps = [
  "h-2",
  "h-3",
  "h-4",
  "h-5",
  "h-6",
  "h-8",
  "h-10",
  "h-12",
  "h-16",
  "h-20",
  "h-24",
  "h-28",
  "h-32",
]
