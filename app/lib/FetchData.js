// app/lib/fetchAllDailymotionData.ts

import { API_URL_DATA, CATEGORY_DATA } from './apilist';

const VIDEO_FIELDS = 'id,thumbnail_240_url,url,title,description,created_time,duration,owner.screenname,owner.username,channel,onair';

async function fetchAllDailymotionData() {
  try {
    // const fetches = API_URL_DATA.slice(0, 3).map(async item => {
    const fetches = API_URL_DATA.map(async item => {
      const isPlaylist = item.isPlaylist;
      const isFeaturedChannel = item.title_slug === 'featured-channels';
      const title = item.title;
      const id = item.playlist_id;

      let url = isPlaylist ? `https://api.dailymotion.com/playlists/?fields=name,id,thumbnail_240_url,videos_total&ids=${item.playlist_id}` : `https://api.dailymotion.com/playlist/${item.playlist_id}/videos?fields=${VIDEO_FIELDS}&limit=7&page=1`;

      if (isFeaturedChannel) {
        url = 'https://api.dailymotion.com/users?fields=id,cover_250_url,avatar_60_url,url,screenname&parent=lokmatonline&sort=recent&limit=7';
      }

      try {
        const response = await fetch(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 Chrome/90.0 Safari/537.36',
          },
          next: { revalidate: 300 }, // Cache for 5 minutes
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        // console.log(data);
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
    const category = CATEGORY_DATA.find(item => item.slug === slug);

    if (!category) {
      console.error(`No category found for slug: ${slug}`);
      return null;
    }

    const playlist = category.playlist.split(',');

    const playlistFetches = playlist.map(async playlistId => {
      const nameUrl = `https://api.dailymotion.com/playlist/${playlistId}/?fields=name`;
      const videosUrl = `https://api.dailymotion.com/playlist/${playlistId}/videos?fields=${VIDEO_FIELDS}&limit=7&page=1`;

      try {
        const [nameResponse, videosResponse] = await Promise.all([
          fetch(nameUrl, {
            headers: { 'User-Agent': 'Mozilla/5.0 Chrome/90.0 Safari/537.36' },
            next: { revalidate: 300 },
          }),
          fetch(videosUrl, {
            headers: { 'User-Agent': 'Mozilla/5.0 Chrome/90.0 Safari/537.36' },
            next: { revalidate: 300 },
          }),
        ]);

        if (!nameResponse.ok || !videosResponse.ok) {
          throw new Error('Failed to fetch playlist data');
        }

        const [nameData, videosData] = await Promise.all([nameResponse.json(), videosResponse.json()]);

        const playlist_slug = nameData.name.replace(/\s+/g, '-').toLowerCase();

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
    return {
      categoryName: category.name,
      slug: category.slug,
      playlists: results.filter(Boolean),
    };
  } catch (error) {
    console.error('Error in fetchCategoryDataBySlug:', error);
    throw error;
  }
}

async function fetchPlaylistDataBySlug(playlistSlug) {
  try {
    // console.log(playlistSlug);

    const playlistIds = API_URL_DATA.find(item => item.title_slug === playlistSlug)?.playlist_id;
    if (!playlistIds) return null;

    // console.log(playlistIds);
    const ids = playlistIds.split(',');
    // console.log(ids);

    const playlistFetches = ids.map(async playlistId => {
      const nameUrl = `https://api.dailymotion.com/playlist/${playlistId}/?fields=name`;
      const videosUrl = `https://api.dailymotion.com/playlist/${playlistId}/videos?fields=id,thumbnail_240_url,url,title,description,created_time,duration,owner.screenname,owner.username,channel,onair&limit=7&page=1`;

      try {
        const [nameResponse, videosResponse] = await Promise.all([
          fetch(nameUrl, {
            headers: { 'User-Agent': 'Mozilla/5.0 Chrome/90.0 Safari/537.36' },
            next: { revalidate: 300 },
          }),
          fetch(videosUrl, {
            headers: { 'User-Agent': 'Mozilla/5.0 Chrome/90.0 Safari/537.36' },
            next: { revalidate: 300 },
          }),
        ]);

        if (!nameResponse.ok || !videosResponse.ok) {
          throw new Error('Failed to fetch playlist data');
        }

        const [nameData, videosData] = await Promise.all([nameResponse.json(), videosResponse.json()]);

        const playlist_slug = nameData.name.replace(/\s+/g, '-').toLowerCase();

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
    // console.log(results)
    return results;
  } catch (error) {
    console.error('Error in fetchCategoryDataBySlug:', error);
    throw error;
  }
}

async function fetchVideoById(videoId) {
  try {
    const url = `https://api.dailymotion.com/video/${videoId}?fields=id,title,thumbnail_480_url,mode,onair,owner.screenname,created_time,start_time,description,thumbnail_240_url,url,channel,owner.url,tags,duration,views_total`;

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 Chrome/90.0 Safari/537.36',
      },
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching video by ID:', error);
    return null;
  }
}

async function fetchRelatedVideos(videoId, page = 1) {
  try {
    const url = `https://api.dailymotion.com/playlist/${videoId}/videos?fields=id,thumbnail_240_url,url,title,description,created_time,duration,owner.screenname,owner.username,channel,onair&limit=12&page=${page}`;

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 Chrome/90.0 Safari/537.36',
      },
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching related videos:', error);
    return { list: [], has_more: false };
  }
}

export { fetchAllDailymotionData, fetchCategoryDataBySlug, fetchVideoById, fetchRelatedVideos, fetchPlaylistDataBySlug };
