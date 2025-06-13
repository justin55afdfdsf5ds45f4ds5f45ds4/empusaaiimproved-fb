import type { ObjectId } from "mongodb"

export interface Invitation {
  _id?: ObjectId
  token: string
  email?: string
  createdAt: Date
  expiresAt: Date
  used: boolean
  usedAt?: Date
  usedBy?: string
  createdBy: string
}

export const INVITATION_EXPIRY_DAYS = 7
