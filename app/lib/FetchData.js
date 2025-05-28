// app/lib/fetchAllDailymotionData.ts

import { API_URL_DATA } from "./apilist";

const VIDEO_FIELDS = 'id,thumbnail_240_url,url,title,description,created_time,duration,owner.screenname,owner.username,channel,onair';

 async function fetchAllDailymotionData() {
  const fetches = API_URL_DATA.slice(0,3).map(async (item) => {
    // console.log(item)
    const isPlaylist = item.isPlaylist;
    const isFeaturedChannel = item.title_slug === 'featured-channels';
    const title = item.title;
    const id = item.playlist_id

    let url = isPlaylist
      ? `https://api.dailymotion.com/playlists/?fields=name,id,thumbnail_240_url,videos_total&ids=${item.playlist_id}`
      : `https://api.dailymotion.com/playlist/${item.playlist_id}/videos?fields=${VIDEO_FIELDS}&limit=7&page=1`;

    try {
      const res = await fetch(url, {
        headers: {
      'User-Agent': 'Mozilla/5.0 Chrome/90.0 Safari/537.36',
        },
        cache: 'force-cache',
      });
      const data = await res.json();

      // console.log(data)

      return {
        title,
        title_slug: item.title_slug,
        isPlaylist,
        isFeaturedChannel,
        data,
        id
      };
    } catch (err) {
      console.error(`Error fetching ${title}:`, err);
      return {
        title,
        title_slug: item.title_slug,
        isPlaylist,
        isFeaturedChannel,
        data: null,
      };
    }
  });

  return Promise.all(fetches);
}

export { fetchAllDailymotionData };