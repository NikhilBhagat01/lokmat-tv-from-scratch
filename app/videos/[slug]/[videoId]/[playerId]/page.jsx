import React from 'react';
import { fetchRelatedVideos, fetchVideoById } from '@/app/lib/FetchData';
import { formatDistanceToNow } from 'date-fns';
import { enUS } from 'date-fns/locale';
import VideoCarousel from '@/app/components/VideoCarousel';
import Link from 'next/link';
import Image from 'next/image';

// Related Video Card Component
const RelatedVideoCard = ({ video, slug, videoId, playerId }) => {
  if (!video) return null;

  // console.log(video);
  // Format duration like "00:00"
  const getDuration = seconds => {
    try {
      if (!seconds || typeof seconds !== 'number') return '';
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
    } catch (error) {
      return '';
    }
  };

  // Format date like "DD MMM YYYY"
  const getFormattedDate = timestamp => {
    try {
      if (!timestamp) return '';
      return new Intl.DateTimeFormat('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        timeZone: 'UTC',
      }).format(new Date(timestamp * 1000));
    } catch (error) {
      console.error('Error formatting date:', error);
      return '';
    }
  };

  // Ensure we have required props before rendering
  if (!video.id || !video.title) {
    return null;
  }

  return (
    <Link href={`/videos/${slug}/${videoId}/${video.id}`} className={`group flex gap-3 hover:bg-neutral-800 p-2 rounded-lg transition ${playerId === video.id ? 'bg-neutral-800' : ''}`}>
      <div className="relative w-40 h-24 flex-shrink-0 rounded overflow-hidden">
        <img src={video.thumbnail_240_url || '/placeholder.jpg'} alt={video.title || 'Video thumbnail'} className="absolute inset-0 w-full h-full object-cover" />
        {typeof video.duration === 'number' && <div className="absolute bottom-1 right-1 bg-black bg-opacity-75 text-white text-xs px-1 rounded">{getDuration(video.duration)}</div>}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-sm text-gray-200 group-hover:text-yellow-400 line-clamp-2 leading-snug">{video.title}</h3>
        {video.created_time && <p className="text-xs text-gray-400 mt-1">{getFormattedDate(video.created_time)}</p>}
      </div>
    </Link>
  );
};

const VideoPlayer = async ({ params }) => {
  const { videoId, playerId, slug } = await params;

  // Fetch video data and trending videos
  const videoData = await fetchVideoById(playerId);
  // console.log(videoData);
  const relatedVideos = await fetchRelatedVideos(videoId);
  // console.log(relatedVideos);

  if (!videoData) {
    return <div>Video not found</div>;
  }

  return (
    <div className="min-h-screen bg-neutral-900">
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Video Player */}
            <div className="relative pt-[56.25%] bg-black rounded-lg overflow-hidden">
              <iframe src={`https://www.dailymotion.com/embed/video/${playerId}?autoplay=1`} allow="autoplay; fullscreen" allowFullScreen className="absolute inset-0 w-full h-full" />
            </div>

            {/* Video Info */}
            <div className="mt-4 space-y-4">
              <h1 className="text-xl md:text-2xl font-semibold text-yellow-400 leading-tight">{videoData?.title}</h1>

              <div className="flex items-center justify-between text-gray-400 text-sm">
                <div className="flex items-center space-x-4">
                  {/* <span>{getFormattedDate(videoData.created_time)}</span> */}
                  <span>•</span>
                  {/* <span>{(videoData.views_total || 0).toLocaleString()} views</span> */}
                </div>

                <div className="flex items-center space-x-4">
                  <button className="hover:text-yellow-400 transition">Share</button>
                </div>
              </div>

              {/* Channel Info */}
              <div className="flex items-center space-x-3 pt-4 border-t border-neutral-700">
                <div className="w-12 h-12 rounded-full bg-neutral-800 flex items-center justify-center">
                  <span className="text-yellow-400 font-semibold">L</span>
                </div>
                <div>
                  <h3 className="font-medium text-yellow-400">Lokmat</h3>
                  <p className="text-sm text-gray-400">{videoData?.channel || 'News'} Channel</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Related Videos */}
          <div className="lg:col-span-1">
            <h2 className="text-lg font-semibold text-yellow-400 mb-4">Related Videos</h2>
            <div className="space-y-4">
              {Array.isArray(relatedVideos?.list) && relatedVideos.list.length > 0 ? relatedVideos.list.map(video => <RelatedVideoCard key={video.id} video={video} slug={slug} videoId={videoId} playerId={playerId} />) : <p className="text-gray-400 text-sm">No related videos available</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// export async function generateMetadata({ params }) {
//   const { videoId, slug, playerId } = await params;
//   const videoData = await fetchVideoById(playerId);

//   if (!videoData) return {};

//   return {
//     title: `${videoData.title} - Lokmat TV`,
//     description: videoData.description || `Watch ${videoData.title} on Lokmat TV. Stay updated with latest news and videos from Maharashtra.`,
//     keywords: `${videoData.title}, ${videoData.channel}, Lokmat TV, Marathi news, video news, Maharashtra news`,
//     metadataBase: new URL('https://www.lokmat.com'),
//     alternates: {
//       canonical: `/videos/${slug}/${videoId}/${playerId}`,
//     },
//     openGraph: {
//       title: videoData.title,
//       description: videoData.description,
//       url: `https://www.lokmat.com/videos/${slug}/${videoId}/${playerId}`,
//       siteName: 'LokmatTV',
//       images: [
//         {
//           url: videoData.thumbnail_480_url || videoData.thumbnail_240_url,
//           width: 480,
//           height: 360,
//         },
//       ],
//       locale: 'mr_IN',
//       type: 'video.other',
//       videos: [
//         {
//           url: `https://www.dailymotion.com/video/${videoData.id}`,
//         },
//       ],
//     },
//     twitter: {
//       card: 'player',
//       title: videoData.title,
//       description: videoData.description,
//       images: [videoData.thumbnail_480_url || videoData.thumbnail_240_url],
//       players: [
//         {
//           url: `https://www.dailymotion.com/embed/video/${videoData.id}`,
//           width: 480,
//           height: 360,
//         },
//       ],
//     },
//   };
// }

export default VideoPlayer;
