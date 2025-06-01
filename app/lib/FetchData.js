// app/lib/fetchAllDailymotionData.ts

import { Redis } from '@upstash/redis';
import { API_URL_DATA, CATEGORY_DATA } from "./apilist";

// Initialize Redis client
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

const VIDEO_FIELDS =
  "id,thumbnail_240_url,url,title,description,created_time,duration,owner.screenname,owner.username,channel,onair";

// Helper function to generate cache key
const generateCacheKey = (type, id, page = 1) => {
  return `lokmat:${type}:${id}:page${page}`;
};

// Helper function to fetch data with caching
async function fetchWithCache(url, cacheKey, ttl = 180) { // TTL in seconds
  try {
    // Try to get data from cache first
    const cachedData = await redis.get(cacheKey);
    if (cachedData) {
      console.log('Cache hit for:', cacheKey);
      return cachedData;
    }

    // If not in cache, fetch from API
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 Chrome/90.0 Safari/537.36",
      },
      next: { revalidate: ttl },
    });

    const data = await res.json();

    // Store in cache
    await redis.set(cacheKey, data, { ex: ttl });
    console.log('Cached data for:', cacheKey);

    return data;
  } catch (error) {
    console.error('Error fetching/caching data:', error);
    throw error;
  }
}

async function fetchAllDailymotionData() {
  try {
    const fetches = API_URL_DATA.slice(0, 3).map(async (item) => {
      // console.log(item)
      const isPlaylist = item.isPlaylist;
      const isFeaturedChannel = item.title_slug === "featured-channels";
      const title = item.title;
      const id = item.playlist_id;

      let url = isPlaylist
        ? `https://api.dailymotion.com/playlists/?fields=name,id,thumbnail_240_url,videos_total&ids=${item.playlist_id}`
        : `https://api.dailymotion.com/playlist/${item.playlist_id}/videos?fields=${VIDEO_FIELDS}&limit=7&page=1`;

      const cacheKey = generateCacheKey(
        isPlaylist ? 'playlist' : 'videos',
        id
      );

      try {
        const data = await fetchWithCache(url, cacheKey);
        return {
          title,
          title_slug: item.title_slug,
          isPlaylist,
          isFeaturedChannel,
          data,
          id,
        };
      } catch (err) {
        console.error(`Error fetching ${title}:`, err);
        return {
          title,
          title_slug: item.title_slug,
          isPlaylist,
          isFeaturedChannel,
          data: null,
          id,
        };
      }
    });

    return Promise.all(fetches);
  } catch (error) {
    console.error('Error in fetchAllDailymotionData:', error);
    throw error;
  }
}

async function fetchCategoryDataBySlug(slug) {
  try {
    // Find the category that matches the slug
    const category = CATEGORY_DATA.find((item) => item.slug === slug);

    if (!category) {
      console.error(`No category found for slug: ${slug}`);
      return null;
    }

    const playlist = category.playlist.split(",");
    const cacheKey = generateCacheKey('category', slug);

    // Check cache first
    const cachedCategory = await redis.get(cacheKey);
    if (cachedCategory) {
      console.log('Cache hit for category:', slug);
      return cachedCategory;
    }

    const playlistFetches = playlist.map(async (playlistId) => {
      const nameUrl = `https://api.dailymotion.com/playlist/${playlistId}/?fields=name`;
      const videosUrl = `https://api.dailymotion.com/playlist/${playlistId}/videos?fields=${VIDEO_FIELDS}&limit=7&page=1`;

      try {
        const [nameData, videosData] = await Promise.all([
          fetchWithCache(
            nameUrl,
            generateCacheKey('playlist-name', playlistId)
          ),
          fetchWithCache(
            videosUrl,
            generateCacheKey('playlist-videos', playlistId)
          ),
        ]);

        const playlist_slug = nameData.name.replace(/\s+/g, "-").toLowerCase();

        return {
          playlistName: nameData.name,
          videos: videosData.list || [],
          slug: playlist_slug,
          id: playlistId,
        };
      } catch (err) {
        console.error(`Error fetching playlist ${playlistId}:`, err);
        return null;
      }
    });

    const results = await Promise.all(playlistFetches);
    const categoryData = {
      categoryName: category.name,
      slug: category.slug,
      playlists: results.filter(Boolean),
    };

    // Cache the entire category data
    await redis.set(cacheKey, categoryData, { ex: 180 }); // Cache for 3 minutes
    return categoryData;
  } catch (error) {
    console.error('Error in fetchCategoryDataBySlug:', error);
    throw error;
  }
}

// async function fetchCategoryData(slug) {

//   const category = CATEGORY_DATA.find(item => item.slug == slug)

//   if (!category) return null
//   // console.log(category)

//   const playlist = category.playlist.split(',')
//   // console.log(playlist)

//   const fetches = playlist.map(async (playlistId) => {
//     // console.log(slug)
//     const cat_slug = slug
//     const name_url = `https://api.dailymotion.com/playlist/${playlistId}/?fields=name`
//     const url = `https://api.dailymotion.com/playlist/${playlistId}/videos?fields=${VIDEO_FIELDS}&limit=7&page=1`

//     const [name_res, url_res] = await Promise.all([
//       fetch(name_url),
//       fetch(url)
//     ])

//     const [name_data, url_data] = await Promise.all([
//       name_res.json(),
//       url_res.json()
//     ])

//     // console.log(name_data, url_data)

//     return {
//       name: name_data.name,
//       url: url_data.list,
//       slug: cat_slug,
//     }

//   })

//   const results = await Promise.all(fetches);
//   // console.log(results)

//   // const fetches = CATEGORY_DATA.map(async (item) => {
//   //   const playlist = item.playlist.split(',');
//   //   const fetches = playlist.map(async (playlistId) => {
//   //     const url = `https://api.dailymotion.com/playlist/${playlistId}/videos?fields=${VIDEO_FIELDS}&limit=7&page=1`;
//   //     const res = await fetch(url);
//   //     const data = await res.json();
//   //     return data;
//   //   })
//   //   const results = await Promise.all(fetches);
//   //   return {
//   //     title: item.name,
//   //     title_slug: item.slug,
//   //     data: results
//   //   }
//   // })
//   // const results = await Promise.all(fetches);
//   // return results;
// }

// Function to clear cache (useful for admin purposes or force refresh)
async function clearCache(type, id) {
  try {
    const pattern = id ? generateCacheKey(type, id, '*') : `lokmat:${type}:*`;
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(keys);
      console.log(`Cleared ${keys.length} cache entries for ${type}`);
    }
  } catch (error) {
    console.error('Error clearing cache:', error);
  }
}

export { fetchAllDailymotionData, fetchCategoryDataBySlug, clearCache };

// // app/lib/fetchAllDailymotionData.ts

// import { API_URL_DATA } from "./apilist";

// const VIDEO_FIELDS = 'id,thumbnail_240_url,url,title,description,created_time,duration,owner.screenname,owner.username,channel,onair';
// const PLAYLIST_FIELDS = 'name,id,thumbnail_240_url,videos_total';
// const USER_FIELDS = 'id,cover_250_url,avatar_60_url,url,screenname';

// // Utility function to delay execution
// const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// // Fetch with retry logic and rate limiting
// async function fetchWithRetry(url, options, retries = 3, backoff = 1000) {
//   for (let i = 0; i < retries; i++) {
//     try {
//       // console.log(`Fetching ${url} (attempt ${i + 1}/${retries})`);
//       const res = await fetch(url, options);

//       // Handle rate limiting
//       if (res.status === 429) {
//         const retryAfter = res.headers.get('Retry-After') || 60;
//         // console.log(`Rate limited. Waiting ${retryAfter}s before retry...`);
//         await delay(retryAfter * 1000);
//         continue;
//       }

//       if (!res.ok) {
//         console.error(`HTTP error for ${url}:`, {
//           status: res.status,
//           statusText: res.statusText
//         });
//         throw new Error(`HTTP error! status: ${res.status}`);
//       }

//       const data = await res.json();

//       // Check for API-level errors
//       if (data.error) {
//         throw new Error(data.error);
//       }

//       return data;
//     } catch (error) {
//       console.error(`Attempt ${i + 1} failed for ${url}:`, error.message);
//       const isLastAttempt = i === retries - 1;
//       if (isLastAttempt) {
//         throw error;
//       }
//       const waitTime = backoff * Math.pow(2, i);
//       // console.log(`Retrying in ${waitTime}ms...`);
//       await delay(waitTime);
//     }
//   }
// }

// // Function to build the appropriate URL based on item type
// function buildApiUrl(item) {
//   const { type, playlist_id } = item;

//   switch (type) {
//     case 'videos':
//       return `https://api.dailymotion.com/playlist/${playlist_id}/videos?fields=${VIDEO_FIELDS}&limit=7&page=1`;
//     case 'playlists':
//       return `https://api.dailymotion.com/playlists/?fields=${PLAYLIST_FIELDS}&ids=${playlist_id}`;
//     case 'users':
//       return `https://api.dailymotion.com/users?fields=${USER_FIELDS}&parent=${playlist_id}&sort=recent&limit=7`;
//     default:
//       throw new Error(`Unknown type: ${type}`);
//   }
// }

// async function fetchAllDailymotionData() {
//   // console.log('Starting to fetch data from:', API_URL_DATA.slice(0, 3));

//   const fetches = API_URL_DATA.slice(0, 3).map(async (item, index) => {
//     // Add delay between requests to avoid rate limiting
//     // await delay(index * 1000);

//     const { title, title_slug, type } = item;

//     try {
//       const url = buildApiUrl(item);
//       // console.log(`Preparing to fetch ${title}:`, { url, type });

//       const fetchOptions = {
//         headers: {
//           'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
//           'Accept': 'application/json',
//           'Cache-Control': 'no-cache'
//         },
//         next: {
//           revalidate: 300 // Cache for 5 minutes
//         }
//       };

//       const data = await fetchWithRetry(url, fetchOptions);

//       // Validate response data structure
//       if (!data) {
//         throw new Error('Empty response received');
//       }

//       // For playlists and users, the response structure is different
//       if (type === 'playlists' || type === 'users') {
//         if (!data.list || !Array.isArray(data.list)) {
//           throw new Error(`Invalid ${type} data structure`);
//         }
//       } else if (type === 'videos') {
//         if (!data.list || !Array.isArray(data.list)) {
//           throw new Error('Invalid video data structure');
//         }
//       }

//       // Check if we got any actual data
//       if (data.list && data.list.length === 0) {
//         console.warn(`No ${type} found for ${title}`);
//       } else {
//         // console.log(`Successfully fetched ${title}:`, {
//         //   type,
//         //   dataLength: data.list?.length || 0
//         // });
//       }

//       return {
//         title,
//         title_slug,
//         type,
//         data
//       };
//     } catch (err) {
//       console.error(`Error fetching ${title}:`, {
//         error: err.message,
//         type
//       });

//       // Return a valid object with empty data instead of throwing
//       return {
//         title,
//         title_slug,
//         type,
//         data: {
//           list: [] // Provide empty list as fallback
//         },
//         error: err.message
//       };
//     }
//   });

//   // Wait for all fetches to complete, even if some fail
//   // console.log('Waiting for all fetches to complete...');
//   const results = await Promise.allSettled(fetches);

//   // Log overall results
//   const fulfilled = results.filter(r => r.status === 'fulfilled').length;
//   const rejected = results.filter(r => r.status === 'rejected').length;
//   // console.log('Fetch results summary:', {
//   //   total: results.length,
//   //   fulfilled,
//   //   rejected
//   // });

//   // Filter out rejected promises and map to values
//   return results
//     .filter(result => result.status === 'fulfilled')
//     .map(result => result.value);
// }

// export { fetchAllDailymotionData };
