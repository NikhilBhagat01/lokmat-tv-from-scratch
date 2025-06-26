'use client';

import React, { useEffect, useState, useRef } from 'react';
import { fetchRelatedVideos } from '@/app/lib/FetchData';
import Link from 'next/link';
import Adbox from './Adbox';

// Related Video Card Component
const RelatedVideoCard = ({ video, slug, videoId, playerId }) => {
  if (!video) return null;

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

const VideoPlayer = ({ initialVideoData, initialRelatedVideos, videoId, playerId, slug }) => {
  const [videoData] = useState(initialVideoData);
  const [relatedVideos, setRelatedVideos] = useState(initialRelatedVideos?.list || []);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialRelatedVideos?.has_more || false);
  const loadingRef = useRef();
  const [isMobile, setIsMobile] = useState(false);

  // console.log(videoData);

  const minutes = Math.floor(videoData.duration / 60);
  const seconds = videoData.duration % 60;
  const formattedDuration = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const formattedDate = new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(videoData.created_time * 1000));

  // Handle responsive layout
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const loadMoreVideos = async () => {
    if (loading || !hasMore) return;

    try {
      setLoading(true);
      const nextPage = page + 1;
      const newVideos = await fetchRelatedVideos(videoId, nextPage);

      setRelatedVideos(prev => [...prev, ...newVideos.list]);
      setHasMore(newVideos.has_more);
      setPage(nextPage);
    } catch (error) {
      console.error('Error loading more videos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMoreVideos();
        }
      },
      { threshold: 0.1 }
    );

    if (loadingRef.current) {
      observer.observe(loadingRef.current);
    }

    return () => observer.disconnect();
  }, [hasMore, loading, page]);

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
                  <span className="text-gray-300 hover:text-yellow-400 transition-colors">{videoData?.views_total} views</span>
                  <span className="text-gray-500">•</span>
                  <span className="text-gray-300 hover:text-yellow-400 transition-colors">{formattedDate}</span>
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
                  <h3 className="font-medium text-yellow-400">{videoData?.owner?.screenname || 'Lokmat'}</h3>
                  <p className="text-sm text-gray-400">{videoData?.channel || 'News'} Channel</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Related Videos */}
          <div className={`lg:col-span-1 ${isMobile ? 'mt-8' : 'sticky top-4 self-start '} hide-scrollbar`}>
            {/* <div className="flex justify-center align-center Adbox">
              <div className="bg-gray-300 w-[300px] h-[250px]"></div>
            </div> */}
            <Adbox />
            <div className={`${isMobile ? '' : 'max-h-[calc(100vh-1rem)] overflow-y-auto scrollbar-none'} rounded-lg bg-neutral-900 scroll-css`}>
              <h2 className="text-lg font-semibold text-yellow-400 mb-4 sticky top-0 bg-neutral-900 py-2 z-10">Related Videos</h2>
              <div className="space-y-4 pb-4">
                {relatedVideos.map(video => (
                  <RelatedVideoCard key={video.id} video={video} slug={slug} videoId={videoId} playerId={playerId} />
                ))}
                {hasMore && (
                  <div ref={loadingRef} className="py-4 text-center">
                    <div className="w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
                  </div>
                )}
                {!hasMore && relatedVideos.length > 0 && <p className="text-gray-400 text-sm text-center py-4">No more videos to load</p>}
                {relatedVideos.length === 0 && <p className="text-gray-400 text-sm">No related videos available</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
