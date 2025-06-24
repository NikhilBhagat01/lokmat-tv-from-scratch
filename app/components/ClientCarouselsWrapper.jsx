'use client';

import React, { useEffect, useState } from 'react';
import Featuredchannel from './Featuredchannel';
import PlaylistCarousel from './PlaylistCarousel';
import VideoCarousel from './VideoCarousel';
import Adbox from './Adbox';
// import Adbox from './Adbox';

const ClientCarouselsWrapper = ({ carousels }) => {
  const [fetchedData, setFetchedData] = useState([]);

  console.log(carousels);
  // console.log('in client carousels wrapper')
  useEffect(() => {
    const fetchAll = async () => {
      const results = await Promise.all(
        carousels.map(async item => {
          const isFeaturedChannel = item.title_slug === 'featured-channels';
          const id = item.playlist_id;
          let url = '';

          if (item.type === 'adbox') {
            return {
              ...item,
            };
          }

          if (item.isPlaylist) {
            url = `https://api.dailymotion.com/playlists/?fields=name,id,thumbnail_240_url,videos_total&ids=${item.playlist_id}`;
          } else {
            url = `https://api.dailymotion.com/playlist/${item.playlist_id}/videos?fields=id,thumbnail_240_url,url,title,description,created_time,duration,owner.screenname,owner.username,channel,onair&limit=7&page=1`;
          }

          // console.log(item.title +'-----'+url)
          try {
            const res = await fetch(url);
            const data = await res.json();

            return {
              ...item,
              isFeaturedChannel,
              data,
              id,
            };
          } catch (err) {
            console.error('Error fetching:', item.url, err);
            return {
              ...item,
              data: null,
              error: true,
              id,
            };
          }
        })
      );
      setFetchedData(results);
    };

    fetchAll();
  }, [carousels]);

  console.log(fetchedData);

  // console.log(fetchedData);
  if (fetchedData.length === 0) {
    return <div className="text-white px-3">Loading carousels...</div>;
  }

  console.log(fetchedData);

  // return (
  //   <>
  //     {fetchedData.map((item, index) => {
  //       const components = [];

  //       if (index % 3 === 0) {
  //         components.push(<Adbox key={`ad-${index}`} />);
  //       }

  //       if (item?.isFeaturedChannel) {
  //         components.push(<Featuredchannel key={item.title_slug || `fc-${index}`} data={item} />);
  //       } else if (item?.isPlaylist || item?.type) {
  //         components.push(<PlaylistCarousel key={item.title_slug || `pc-${index}`} data={item} />);
  //       } else {
  //         components.push(<VideoCarousel key={item.title_slug || `vc-${index}`} title={item.title} slug={item.title_slug} data={item.data?.list || []} id={item.id} />);
  //       }

  //       return components;
  //     })}
  //   </>
  // );

  return (
    <>
      {fetchedData.map((item, index) => {
        if (item.type === 'adbox') {
          return <Adbox key={item.id || `ad-${index}`} width="800px" height="100px" />;
        }
        if (item?.isFeaturedChannel) {
          return <Featuredchannel key={item.title_slug || index} data={item} />;
        }

        if (item?.isPlaylist || item?.type) {
          return <PlaylistCarousel key={item.title_slug || index} data={item} />;
        }

        // Default to VideoCarousel with id prop
        return <VideoCarousel key={item.title_slug || index} title={item.title} slug={item.title_slug} data={item.data?.list || []} id={item.id} />;
      })}
    </>
  );
};

export default ClientCarouselsWrapper;
