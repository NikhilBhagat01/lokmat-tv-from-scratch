'use client';

import { useEffect, useState, useRef, useCallback } from "react";

const ExpandPlaylist = ({ videoId }) => {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [showVideo, setShowVideo] = useState(false);
  const [videos, setVideos] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef();

  // Fetch videos from API
  const fetchVideos = async (pageNum) => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://api.dailymotion.com/playlist/${videoId}/videos?fields=id,thumbnail_240_url,url,title,description,created_time,duration,owner.screenname,owner.username,channel,onair&limit=12&page=${pageNum}`,
        {
          headers: {
            "User-Agent": "Mozilla/5.0 Chrome/90.0 Safari/537.36",
          },
        }
      );
      const data = await response.json();
      
      if (pageNum === 1) {
        setVideos(data.list);
        setSelectedVideo(data.list[0]);
      } else {
        setVideos(prev => [...prev, ...data.list]);
      }
      
      setHasMore(data.has_more);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching videos:", error);
      setLoading(false);
    }
  };

  // Initialize first page
  useEffect(() => {
    setPage(1);
    fetchVideos(1);
  }, [videoId]);

  // Show thumbnail for 2 seconds before playing
  useEffect(() => {
    if (selectedVideo) {
      setShowVideo(false);
      const timer = setTimeout(() => {
        setShowVideo(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [selectedVideo]);

  // Intersection Observer for infinite scroll
  const lastVideoRef = useCallback(node => {
    if (loading) return;
    
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
        fetchVideos(page + 1);
      }
    });

    if (node) {
      observerRef.current.observe(node);
    }
  }, [loading, hasMore]);

  if (!selectedVideo) return null;

  return (
    <div className="bg-black text-yellow-400 px-4 md:pt-[43px] font-sans md:mb-6">
      <div className="flex flex-col md:flex-row-reverse items-center gap-4 mb-8 md:max-h-[400px] relative">
        {/* Video or Image */}
        <div className="w-full md:w-3/5">
          <div className="w-full aspect-video rounded-lg overflow-hidden">
            {showVideo ? (
              <iframe
                src={`https://www.dailymotion.com/widget/preview/video/${selectedVideo.id}?title=none&duration=none&mode=video&trigger=auto`}
                title="Dailymotion Video"
                allowFullScreen
                loading="lazy"
                className="w-full h-full"
              />
            ) : (
              <div className="relative w-full h-full">
                <img
                  src={selectedVideo.thumbnail_240_url}
                  alt={selectedVideo.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Text */}
        <div className="w-full md:w-2/5 md:text-left">
          <h2 className="text-xl md:text-2xl font-bold mb-4">
            {selectedVideo.title}
          </h2>
          <button
            className="bg-yellow-400 text-black px-4 py-2 rounded hover:bg-yellow-300 font-semibold flex items-center gap-2"
            onClick={() => setShowVideo(true)}
          >
            <svg
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M6 4l10 6-10 6V4z" />
            </svg>
            Play Now
          </button>
        </div>
      </div>

      {/* Video List */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-8">
        {videos.map((video, index) => {
          const isLastVideo = index === videos.length - 1;
          return (
            <div
              key={video.id}
              ref={isLastVideo ? lastVideoRef : null}
              className={`cursor-pointer group ${
                selectedVideo.id === video.id ? 'ring-2 ring-yellow-400' : ''
              }`}
              onClick={() => {
                setSelectedVideo(video);
                setShowVideo(false);
              }}
            >
              <div className="aspect-video relative overflow-hidden rounded-lg">
                <img
                  src={video.thumbnail_240_url}
                  alt={video.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-1 text-xs text-white rounded">
                  {Math.floor(video.duration / 60)}:{(video.duration % 60).toString().padStart(2, '0')}
                </div>
              </div>
              <h3 className="mt-2 text-sm text-gray-200 line-clamp-2 group-hover:text-yellow-400">
                {video.title}
              </h3>
            </div>
          )}
        )}
      </div>

      {loading && (
        <div className="flex justify-center my-4">
          <div className="w-8 h-8 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
};

export default ExpandPlaylist;
