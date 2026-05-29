import { SubscriptionType } from "./subscription"

export enum UserRole {
  STUDENT = "STUDENT",
  ADMIN = "ADMIN",
  PARTNER = "PARTNER",
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
  account_type: AccountType | string
  profile_picture: string
  date_created: string
  referral_code?: string
  organization_name?: string
  subscription: SubscriptionType
  // Flat subscription fields returned directly on the user object
  subscription_status?: string
  plan_type?: string | null
  plan_id?: number | null
  amount_paid?: number | null
  duration?: string | null
  start_date?: string | null
  end_date?: string | null
  paid_at?: string | null
  family_profiles: FamilyProfile[]
}
