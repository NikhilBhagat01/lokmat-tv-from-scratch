import { API_URL_DATA } from './apilist';

const VIDEO_FIELDS =
  'id,thumbnail_240_url,url,title,description,created_time,duration,owner.screenname,owner.username,channel,onair';

export async function fetchAllDailymotionData() {
  const fetches = API_URL_DATA.map(async (item) => {
    const isPlaylist = item.isPlaylist;
    const isFeaturedChannel = item.title_slug === 'featured-channels';
    const title = item.title;

    let url = '';

    if (!isPlaylist) {
      url = `https://api.dailymotion.com/playlist/${item.playlist_id}/videos?fields=${VIDEO_FIELDS}&limit=7&page=1`;
    } else {
      url = `https://api.dailymotion.com/playlists/?fields=name,id,thumbnail_240_url,videos_total&ids=${item.playlist_id}`;
    }

    try {
         const res = await fetch(url, {
        cache: 'force-cache',
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/90.0.4430.85 Safari/537.36',
        },
      });
      const data = await res.json();

      return {
        title,
        title_slug: item.title_slug,
        isPlaylist,
        isFeaturedChannel,
        data,
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
