export const dynamic = 'force-static';
export const revalidate = 180; // Revalidate the page itself every 180 seconds (3 minutes)

import NewsLayout from '@/app/components/NewsLayout';
import VideoCarousel from '@/app/components/VideoCarousel';
import { fetchCategoryDataBySlug } from '@/app/lib/FetchData';
import { redirect } from 'next/navigation';

export async function generateMetadata({ params }) {
  const { slug } = params;
  const data = await fetchCategoryDataBySlug(slug);

  if (!data) return {};

  const firstPlaylist = data?.playlists[0] || [];
  const firstVideo = firstPlaylist?.videos?.[0] || {};
  const categoryName = firstPlaylist.playlistName || '';

  return {
    title: `${categoryName} - Lokmat TV Videos`,
    description: `Watch latest ${categoryName} videos on Lokmat TV. Stay updated with breaking news, exclusive stories, and trending videos from ${categoryName}.`,
    keywords: `${categoryName}, Lokmat TV, Marathi news, video news, latest ${categoryName} news, ${categoryName} videos, news updates, Lokmat live`,
    metadataBase: new URL('https://www.lokmat.com'),
    alternates: {
      canonical: `/videos/${slug}`,
    },
    links: [
      {
        rel: 'amphtml',
        href: `https://www.lokmat.com/videos/${slug}/amp/`,
      },
    ],
    openGraph: {
      title: `${categoryName} - Lokmat TV Videos`,
      description: `Watch latest ${categoryName} videos on Lokmat TV. Breaking news and exclusive stories from ${categoryName}.`,
      url: `https://www.lokmat.com/videos/${slug}`,
      siteName: 'LokmatTV',
      images: [
        {
          url: firstVideo?.thumbnail_240_url || 'https://d3pc1xvrcw35tl.cloudfront.net/images/686x514/homepage-og_201912337337.jpg',
          width: 1200,
          height: 630,
        },
      ],
      locale: 'mr_IN',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${categoryName} - Lokmat TV Videos`,
      description: `Watch latest ${categoryName} videos on Lokmat TV. Breaking news and exclusive stories.`,
      images: [firstVideo?.thumbnail_240_url || 'https://d3pc1xvrcw35tl.cloudfront.net/images/686x514/homepage-og_201912337337.jpg'],
    },
  };
}

const page = async ({ params }) => {
  const { slug } = await params;

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
        <VideoCarousel key={index} title={item.playlistName} slug={item.slug} data={item.videos} id={item.id} />
      ))}
    </>
  );
};

export default page;
