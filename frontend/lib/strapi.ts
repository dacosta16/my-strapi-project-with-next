import qs from "qs"

export const STRAPI_BASE_URL = (process.env.STRAPI_BASE_URL || "http://localhost:1337").replace(/\/$/, "")

const QUERY_HOME_PAGE = {
  populate: {
    sections: {
      on: {
        "layout.hero-section": {
          populate: {
            image: {
              fields: ["url", "alternativeText"],
            },
            link: {
              populate: true,
            },
          },
        },
      },
    },
  },
}

export async function getHomePage() {
  const query = qs.stringify(QUERY_HOME_PAGE, {
    encodeValuesOnly: true,
  })
  const response = await getStrapiData(`/api/home-page?${query}`)
  return response?.data
}

export async function getStrapiData(url: string) {
  console.log("[v0] STRAPI_BASE_URL:", STRAPI_BASE_URL)
  console.log("[v0] getStrapiData URL:", url)

  try {
    const cleanUrl = url.startsWith("/") ? url : `/${url}`
    const fullUrl = `${STRAPI_BASE_URL}${cleanUrl}`

    console.log("[v0] Full URL being fetched:", fullUrl)

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

    const response = await fetch(fullUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    console.log("[v0] Response status:", response.status)
    console.log("[v0] Response ok:", response.ok)

    if (!response.ok) {
      const errorText = await response.text()
      console.error("[v0] Error response body:", errorText)
      throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`)
    }

    const data = await response.json()
    console.log("[v0] Data received successfully")
    return data
  } catch (error) {
    console.error("[v0] Error fetching data:", error)
    return {
      error: error instanceof Error ? error.message : "Unknown error",
      details: {
        url: `${STRAPI_BASE_URL}${url}`,
        baseUrl: STRAPI_BASE_URL,
        isDefaultUrl: STRAPI_BASE_URL === "http://localhost:1337",
      },
    }
  }
}

export async function registerUserService(userData: object) {
  const url = `${STRAPI_BASE_URL}/api/auth/local/register`

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    })

    const data = await response.json()
    console.log(data)
    return data
  } catch (error) {
    console.error("Error registering user:", error)
    throw error
  }
}

export async function loginUserService(userData: object) {
  const url = `${STRAPI_BASE_URL}/api/auth/local`

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    })

    const data = await response.json()
    console.log(data)
    return data
  } catch (error) {
    console.error("Error login user:", error)
    throw error
  }
}
