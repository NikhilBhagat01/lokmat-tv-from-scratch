import { API_URL_DATA } from "./apilist";


const VIDEO_FIELDS =
  'id,thumbnail_240_url,url,title,description,created_time,duration,owner.screenname,owner.username,channel,onair';

export async function fetchAllDailymotionData() {
  const fetches = API_URL_DATA.map(async (item) => {
    let url = '';
    let type = item.isPlaylist? true:false
    let isFeturedChannel = item.title_slug === 'featured-channels' ? true : false;
    let title = item.title

    if (!item.isPlaylist) {
      url = `https://api.dailymotion.com/playlist/${item.playlist_id}/videos?fields=${VIDEO_FIELDS}&limit=7&page=1`;
      
    } else {
      url = `https://api.dailymotion.com/playlists/?fields=name,id,thumbnail_240_url,videos_total&ids=${item.playlist_id}`;
    }

    // if(item.title_slug == 'trending-videos'){
    //   console.log(url)
    // }

    
    try {
      const res = await fetch(url, { cache: 'no-store' });
      const data = await res.json();
    //   return [data]
      return {  data,type,isFeturedChannel,title };
    } catch (err) {
      console.error(`Error fetching ${item.title}:`, err);
      return { ...item, data: null };
    }
  });

  return Promise.all(fetches);
}
