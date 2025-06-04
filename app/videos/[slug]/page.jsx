export const dynamic = 'force-static';
export const revalidate = 180; // Revalidate the page itself every 180 seconds (3 minutes)

import NewsLayout from '@/app/components/NewsLayout';
import VideoCarousel from '@/app/components/VideoCarousel';
import { fetchCategoryDataBySlug } from '@/app/lib/FetchData';
import { redirect } from 'next/navigation';

const page = async ({ params }) => {
  const { slug } = params;

  const data = await fetchCategoryDataBySlug(slug);

  if (!data) return redirect('/');

  const firstPlaylist = data?.playlists[0] || [];
  const topStories = firstPlaylist?.videos || [];

  const topStoriesTitle = firstPlaylist.playlistName;
  const topStoriesSlug = firstPlaylist.slug;
  const topStoriesId = firstPlaylist.id;

  return (
    <>
      <NewsLayout data={topStories} title={topStoriesTitle} slug={topStoriesSlug} id={topStoriesId} />

      {data?.playlists?.slice(1).map((item, index) => (
        <VideoCarousel key={index} title={item.playlistName} slug={item.slug} data={item.videos} />
      ))}
    </>
  );
};

export default page;
