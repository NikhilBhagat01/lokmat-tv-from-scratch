import VideoPlayerClient from '../../../../components/VideoPlayer';
import { fetchVideoById, fetchRelatedVideos } from '@/app/lib/FetchData';

// export async function generateMetadata({ params }) {
//   const { videoId, slug, playerId } = params;
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

const VideoPlayerPage = async ({ params }) => {
  const { videoId, playerId, slug } = await params;

  // Fetch initial data
  const [videoData, relatedVideos] = await Promise.all([fetchVideoById(playerId), fetchRelatedVideos(videoId, 1)]);

  // console.log(videoData);

  return <VideoPlayerClient initialVideoData={videoData} initialRelatedVideos={relatedVideos} videoId={videoId} playerId={playerId} slug={slug} />;
};

export default VideoPlayerPage;
