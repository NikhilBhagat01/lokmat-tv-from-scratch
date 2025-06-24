export const dynamic = 'force-static';
export const revalidate = 180; // Revalidate the page itself every 180 seconds (3 minutes)

import NewsLayout from '@/app/components/NewsLayout';
import VideoCarousel from '@/app/components/VideoCarousel';
import { fetchPlaylistDataBySlug } from '@/app/lib/FetchData';
import { redirect } from 'next/navigation';
import React from 'react';

const page = async ({ params }) => {
  const { slug } = await params;
  // console.log(slug);

  const playlistData = await fetchPlaylistDataBySlug(slug);

  console.log(playlistData);
  if (!playlistData) return redirect('/');

  const firstPlaylist = playlistData[0] || [];
  const topStories = firstPlaylist?.videos || [];

  const topStoriesTitle = firstPlaylist.playlistName;
  const topStoriesSlug = firstPlaylist.slug;
  const topStoriesId = firstPlaylist.id;

  return (
    <>
      <NewsLayout data={topStories} title={topStoriesTitle} slug={topStoriesSlug} id={topStoriesId} />

      {playlistData?.slice(1).map((item, index) => (
        <VideoCarousel key={index} title={item.playlistName} slug={item.slug} data={item.videos} id={item.id} />
      ))}
    </>
  );
};

export default page;
