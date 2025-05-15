/**
 * Pinterest API helper functions
 */

/**
 * Refreshes a Pinterest access token using the refresh token
 */
export async function refreshPinterestToken(
  refreshToken: string,
): Promise<{ success: boolean; accessToken?: string; refreshToken?: string; expiresAt?: Date }> {
  try {
    if (!refreshToken) {
      return { success: false }
    }

    const response = await fetch("https://api.pinterest.com/v5/oauth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: refreshToken,
        client_id: process.env.AUTH_PINTEREST_ID || "",
        client_secret: process.env.AUTH_PINTEREST_SECRET || "",
      }),
    })

    if (!response.ok) {
      console.error("Failed to refresh Pinterest token:", await response.text())
      return { success: false }
    }

    const data = await response.json()
    const { access_token, refresh_token, expires_in } = data

    return {
      success: true,
      accessToken: access_token,
      refreshToken: refresh_token,
      expiresAt: new Date(Date.now() + expires_in * 1000),
    }
  } catch (error) {
    console.error("Error refreshing Pinterest token:", error)
    return { success: false }
  }
}

/**
 * Fetches a user's Pinterest profile
 */
export async function getPinterestProfile(accessToken: string) {
  try {
    const response = await fetch("https://api.pinterest.com/v5/user_account", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!response.ok) {
      console.error("Failed to fetch Pinterest profile:", await response.text())
      return null
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching Pinterest profile:", error)
    return null
  }
}

/**
 * Fetches a user's Pinterest boards
 */
export async function getPinterestBoards(accessToken: string) {
  try {
    const response = await fetch("https://api.pinterest.com/v5/boards", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!response.ok) {
      console.error("Failed to fetch Pinterest boards:", await response.text())
      return null
    }

    const data = await response.json()
    return data.items || []
  } catch (error) {
    console.error("Error fetching Pinterest boards:", error)
    return null
  }
}

/**
 * Creates a new Pinterest pin
 */
export async function createPinterestPin(
  accessToken: string,
  boardId: string,
  imageUrl: string,
  title: string,
  description = "",
) {
  try {
    const response = await fetch("https://api.pinterest.com/v5/pins", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        board_id: boardId,
        media_source: {
          source_type: "image_url",
          url: imageUrl,
        },
        title,
        description,
        alt_text: title,
      }),
    })

    if (!response.ok) {
      console.error("Failed to create Pinterest pin:", await response.text())
      return null
    }

    return await response.json()
  } catch (error) {
    console.error("Error creating Pinterest pin:", error)
    return null
  }
}
