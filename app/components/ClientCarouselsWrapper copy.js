"use client";

import React, { useEffect } from "react";
import Featuredchannel from "./Featuredchannel";
import PlaylistCarousel from "./PlaylistCarousel";
import VideoCarousel from "./VideoCarousel";



const ClientCarouselsWrapper = ({ carousels }) => {
  // console.table(carousels)

  // const formateddata = carousels.map((item) => {
  //   return {
  //     id: item.playlist_id,
  //     title_slug: item.title_slug,
  //     isPlaylist: item.isPlaylist,
  //   }
  // })

  useEffect(()=>{
const fetchData = async(data)=>{
  // console.table(data)
  const isPlaylist = item.isPlaylist;
    const isFeaturedChannel = item.title_slug === 'featured-channels';
    const title = item.title;
    const id = item.playlist_id


}
  },[])
  


  return (
    <>
      {carousels.map((item, index) => {
        // console.table(item)
        if (item?.isFeaturedChannel) {
          return <Featuredchannel key={index} data={item} />;
        }

        if (item?.isPlaylist || item?.type) {
          return <PlaylistCarousel key={index} data={item} />;
        }

        if (!item?.isPlaylist) {
          // console.table(item)
          return (
            <VideoCarousel
              key={index}
              title={item.title}
              slug={item.title_slug}
              id={item.id}
            />
          );
        }

        return null;
      })}
    </>
  );
};

export default ClientCarouselsWrapper;
