"use client";

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
        setVideos((prev) => [...prev, ...data.list]);
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
  const lastVideoRef = useCallback(
    (node) => {
      if (loading || !hasMore) return;

      if (observerRef.current) {
        observerRef.current.disconnect();
      }

      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore) {
            // console.log('Loading next page:', page + 1); // Debug log
            const nextPage = page + 1;
            setPage(nextPage);
            fetchVideos(nextPage);
          }
        },
        {
          root: null,
          rootMargin: "100px", // Load earlier, before reaching the very bottom
          threshold: 0.1, // Trigger when even 10% of the element is visible
        }
      );

      if (node) {
        observerRef.current.observe(node);
      }
    },
    [loading, hasMore, page, videoId]
  );

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
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M6 4l10 6-10 6V4z" />
            </svg>
            Play Now
          </button>
        </div>
      </div>

      {/* Video List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-8">
        {videos.map((video, index) => {
          const isLastVideo = index === videos.length - 1;
          const formattedDate = new Intl.DateTimeFormat("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            timeZone: "UTC",
          }).format(new Date(video.created_time * 1000));

          return (
            <div
              key={video.id}
              ref={isLastVideo ? lastVideoRef : null}
              className={`cursor-pointer group bg-neutral-900 rounded-lg p-2 ${
                selectedVideo.id === video.id ? "ring-2 ring-yellow-400" : ""
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
                <div className="absolute top-1 right-1 bg-black/80 px-1.5 py-0.5 text-xs text-white rounded">
                  {Math.floor(video.duration / 60)}:
                  {(video.duration % 60).toString().padStart(2, "0")}
                </div>
              </div>
              <div className="mt-2 px-1">
                <div className="text-yellow-300 text-xs mb-1">
                  {formattedDate}
                </div>
                <h3 className="text-[15px] text-yellow-400 font-medium leading-snug line-clamp-3 group-hover:text-yellow-300">
                  {video.title}
                </h3>
              </div>
            </div>
          );
        })}
      </div>

      {/* Loading indicator */}
      {loading && (
        <div className="flex justify-center my-4">
          <div className="w-8 h-8 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* End of content indicator */}
      {!hasMore && videos.length > 0 && (
        <div className="text-center text-gray-400 my-4">
          No more videos to load
        </div>
      )}
    </div>
  );
};

export default ExpandPlaylist;
