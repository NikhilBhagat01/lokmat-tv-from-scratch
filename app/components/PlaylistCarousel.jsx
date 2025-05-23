"use client";

import { useState } from "react";
import Slider from "react-slick";
import { ChevronRight, MoreHorizontal } from "lucide-react";
import HeadingText from "./HeadingText";

// Sample data with Dailymotion video IDs
const featuredPlaylists = [
  {
    name: "Mahayudh",
    id: "x86asy",
    thumbnail_240_url: "https://s1.dmcdn.net/v/WQ-i61e0GUaoZvrAB/x240",
    videos_total: 29,
  },
  {
    name: "News & Views",
    id: "x860li",
    thumbnail_240_url: "https://s1.dmcdn.net/v/WQ-hm1clSFkSRH5V9/x240",
    videos_total: 56,
  },
  {
    name: "Hot & Trending in Sakhi",
    id: "x7h8av",
    thumbnail_240_url: "https://s2.dmcdn.net/v/TvAbo1e8nP6rIR2lb/x240",
    videos_total: 133,
  },
  {
    name: "Hot & Trending in Entertainment",
    id: "x7h761",
    thumbnail_240_url: null,
    videos_total: 102,
  },
  {
    name: "Trending Viral Videos",
    id: "x7h75w",
    thumbnail_240_url: "https://s2.dmcdn.net/v/XhTg01e9AocVtwRS4/x240",
    videos_total: 98,
  },
  {
    name: "Jyotish Shastra",
    id: "x7h752",
    thumbnail_240_url: "https://s2.dmcdn.net/v/V78CI1e0HJvwSmDKR/x240",
    videos_total: 24,
  },
  {
    name: "Inspirational Stories",
    id: "x7h750",
    thumbnail_240_url: "https://s2.dmcdn.net/v/U-zkw1clSs547cwJj/x240",
    videos_total: 15,
  },
  {
    name: "Hello Pune",
    id: "x7h72r",
    thumbnail_240_url: "https://s1.dmcdn.net/v/X-Gji1dmQuviyC_t5/x240",
    videos_total: 234,
  },
];

// Simple Dailymotion Card Component
const DailymotionCard = ({ videoId, title, videoCount, thumbnailUrl }) => {
  // Construct the Dailymotion thumbnail URL

  return (
    <div className="relative cursor-pointer">
      <div className="relative overflow-hidden   rounded-lg ">
        {/* Thumbnail */}
        <div className="relative">
          <img
            src={thumbnailUrl}
            alt={title}
            className="w-full h-40 object-fill"
          />
        </div>

        {/* Colored bar at bottom with title */}
        <div className="p-2 relative bg-[#242222]">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-white text-sm">{title}</h3>
            <ChevronRight size={16} className="text-white opacity-70" />
          </div>
          <div className="text-xs text-gray-100 opacity-80">
            {videoCount} videos
          </div>
        </div>
      </div>
    </div>
  );
};

// Featured Playlists Carousel with React Slick
export default function PlaylistsCarousel() {
  // Custom arrow component for the slider
  const NextArrow = (props) => {
    const { className, style, onClick } = props;
    return (
      <div
        onClick={onClick}
        className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/30 hover:bg-white/50 text-black rounded-full w-9 h-9 flex items-center justify-center backdrop-blur-sm cursor-pointer"
      >
        <ChevronRight className="w-6 h-6" />
      </div>
    );
  };

  const PrevArrow = ({ onClick }) => (
    <div
      onClick={onClick}
      className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/30 hover:bg-white/50 text-black rounded-full w-9 h-9 flex items-center justify-center backdrop-blur-sm cursor-pointer"
    >
      <ChevronRight className="w-6 h-6 rotate-180" />
    </div>
  );

  // React Slick settings
  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 5.2,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 4,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <div className=" mb-14 px-2">
      <div className="flex justify-between items-center mb-4">
        <HeadingText name="Featured Playlists" link="/" />
      </div>

      <div className="relative px-1">
        <Slider {...settings}>
          {featuredPlaylists.map((playlist) => (
            <div key={playlist.id} className="px-3">
              <DailymotionCard
                videoId={playlist.videoId}
                title={playlist.name}
                videoCount={playlist.videos_total}
                thumbnailUrl={
                  playlist.thumbnail_240_url ||
                  "https://s1.dmcdn.net/v/WQ-hm1clSFkSRH5V9/x240"
                }
              />
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
}
