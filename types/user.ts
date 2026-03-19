import { SubscriptionType } from "./subscription"

export enum UserRole {
  STUDENT = "STUDENT",
  ADMIN = "ADMIN",
}
export type UserType = {
  id: number
  first_name: string
  last_name: string
  email_address: string
  age_group: string
  user_role: UserRole
  profile_picture: string
  date_created: string
  subscription: SubscriptionType
}
