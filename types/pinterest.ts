export interface PinterestProfile {
  id: string
  username: string
  profile_image?: string
  account_type?: string
  bio?: string
  website_url?: string
}

export interface PinterestTokens {
  accessToken: string
  refreshToken: string
  expiresAt: Date
}

export interface PinterestConnection {
  userId: string
  profile: PinterestProfile
  accessToken: string
  refreshToken: string
  expiresAt: Date
}

export interface PinterestBoard {
  id: string
  name: string
  description?: string
  url: string
  imageUrl?: string | null
}

export interface PinterestPin {
  id: string
  title: string
  description?: string
  url: string
  imageUrl: string
  boardId: string
  createdAt: Date
}
