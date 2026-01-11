import { cacheLife } from 'next/cache';
import qs from 'qs';

export const STRAPI_BASE_URL = process.env.STRAPI_BASE_URL || "http://localhost:1337";

const QUERY_HOME_PAGE = {
  populate: {
    sections: {
      on: {
        "layout.hero-section": {
          populate: {
            image: {
              fields: ["url", "alternativeText"]
            },
            link: {
              populate: true
            }
          }
        }
      }
    }
  }
}

export async function getHomePageData() {
    'use cache';
    cacheLife({ expire: 60 }) //1 minute cache

    const query = qs.stringify(QUERY_HOME_PAGE, { encodeValuesOnly: true });
    const response = await getStrapiData(`/api/home-page?${query}`);
    return response?.data;
}

export async function getStrapiData(url: string) {
    console.log('getStrapiData');

    try {
        const response = await fetch(`${STRAPI_BASE_URL}${url}`);
        if (!response.ok) {
            throw new Error(`Error fetching data from Strapi: ${response.statusText}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function registerUserService(userData: object) {
  const url = `${STRAPI_BASE_URL}/api/auth/local/register`;

  try {
      const response = await fetch(url, {
          method: 'POST',
          headers: {  
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData),
      }); 
      if (!response.ok) {
          throw new Error(`Error registering user: ${response.statusText}`);
      }
      const data = await response.json();
      console.log(data);
      return data;
  } catch (error) {
      console.error(error);
      return null;
  }
}

export async function loginUserService(userData: object) {
  const url = `${STRAPI_BASE_URL}/api/auth/local`;

  try {
      const response = await fetch(url, {
          method: 'POST',
          headers: {  
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData),
      }); 
      if (!response.ok) {
          throw new Error(`Error login user: ${response.statusText}`);
      }
      const data = await response.json();
      console.log(data);
      return data;
  } catch (error) {
      console.error(error);
      return null;
  }
}