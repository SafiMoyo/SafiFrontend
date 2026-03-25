import { SubscriptionType } from "./subscription"

export enum UserRole {
  STUDENT = "STUDENT",
  ADMIN = "ADMIN",
}

export enum AccountType {
  INDIVIDUAL = "INDIVIDUAL",
  FAMILY = "FAMILY",
}

export type FamilyProfile = {
  id: number
  first_name: string
  last_name: string
  age_group: string
  profile_picture: string
  subscription: SubscriptionType
}

export type UserType = {
  id: number
  first_name: string
  last_name: string
  email_address: string
  age_group: string
  user_role: UserRole
  account_type: AccountType
  profile_picture: string
  date_created: string
  subscription: SubscriptionType
  family_profiles: FamilyProfile[]
}
