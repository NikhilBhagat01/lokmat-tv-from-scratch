"use client";

import React, { useEffect, useState } from "react";
import Featuredchannel from "./Featuredchannel";
import PlaylistCarousel from "./PlaylistCarousel";
import VideoCarousel from "./VideoCarousel";

const ClientCarouselsWrapper = ({ carousels }) => {
  const [fetchedData, setFetchedData] = useState([]);

  useEffect(() => {
    const fetchAll = async () => {
      const results = await Promise.all(
        carousels.map(async (item) => {
          const isFeaturedChannel = item.title_slug === "featured-channels";
          // const id = item.playlist_id;
          let url = "";
          if (item.isPlaylist) {
            url = `https://api.dailymotion.com/playlists/?fields=name,id,thumbnail_240_url,videos_total&ids=${item.playlist_id}`;
          } else {
            url = `https://api.dailymotion.com/playlist/${item.playlist_id}/videos?fields=id,thumbnail_240_url,url,title,description,created_time,duration,owner.screenname,owner.username,channel,onair&limit=7&page=1`;
          }
          // console.log(item.title +'-----'+url)
          try {
            const res = await fetch(url);
            const data = await res.json();

            return { ...item, isFeaturedChannel, data }; // Merge original item with fetched data
          } catch (err) {
            console.error("Error fetching:", item.url, err);
            return { ...item, data: null, error: true };
          }
        })
      );
      setFetchedData(results);
    };

    fetchAll();
  }, [carousels]);

  console.log(fetchedData);
  if (fetchedData.length === 0) {
    return <div className="text-white px-3">Loading carousels...</div>;
  }

  return (
    <>
      {fetchedData.map((item, index) => {
        if (item?.isFeaturedChannel) {
          return <Featuredchannel key={item.title_slug || index} data={item} />;
        }

        if (item?.isPlaylist || item?.type) {
          return (
            <PlaylistCarousel key={item.title_slug || index} data={item} />
          );
        }

        // Default to VideoCarousel
        return (
          <VideoCarousel
            key={item.title_slug || index}
            title={item.title}
            slug={item.title_slug}
            id={item.id}
            data={item.data?.list || []}
          />
        );
      })}
    </>
  );
};

export default ClientCarouselsWrapper;
