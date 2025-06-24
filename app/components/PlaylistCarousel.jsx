'use client';

import { useState } from 'react';
import Slider from 'react-slick';
import { ChevronRight, MoreHorizontal } from 'lucide-react';
import HeadingText from './HeadingText';
import LazyImage from './LazyImage';

// Simple Dailymotion Card Component
const DailymotionCard = ({ videoId, title, videoCount, thumbnailUrl }) => {
  // Construct the Dailymotion thumbnail URL
  return (
    <div className="relative cursor-pointer">
      <div className="relative overflow-hidden   rounded-lg ">
        {/* Thumbnail */}
        <div className="relative">
          <LazyImage src={thumbnailUrl} alt={title} width={320} height={160} className="w-full h-40 object-fill" sizes="(max-width: 768px) 80vw, 20vw" />
        </div>

        {/* Colored bar at bottom with title */}
        <div className="p-2 relative bg-[#242222]">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-white text-sm">{title}</h3>
            <ChevronRight size={16} className="text-white opacity-70" />
          </div>
          <div className="text-xs text-gray-100 opacity-80">{videoCount} videos</div>
        </div>
      </div>
    </div>
  );
};

// Featured Playlists Carousel with React Slick
export default function PlaylistsCarousel({ data }) {
  // console.log(data);
  // console.log(data.data.list);
  // Custom arrow component for the slider
  const NextArrow = props => {
    const { className, style, onClick } = props;
    return (
      <div onClick={onClick} className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/30 hover:bg-white/50 text-black rounded-full w-9 h-9 flex items-center justify-center backdrop-blur-sm cursor-pointer">
        <ChevronRight className="w-6 h-6" />
      </div>
    );
  };

  const PrevArrow = ({ onClick }) => (
    <div onClick={onClick} className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/30 hover:bg-white/50 text-black rounded-full w-9 h-9 flex items-center justify-center backdrop-blur-sm cursor-pointer">
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
    <div className="mb-14 px-1 md:px-2">
      <div className="flex justify-between items-center mb-4">
        <HeadingText name={data.title} link={data.title_slug} isPlayList />
      </div>

      {/* Desktop Carousel */}
      <div className="relative px-1 hidden md:block">
        <Slider {...settings}>
          {data?.data?.list?.map(playlist => (
            <div key={playlist.id} className="px-3">
              <DailymotionCard videoId={playlist.id} title={playlist.name} videoCount={playlist.videos_total} thumbnailUrl={playlist.thumbnail_240_url || 'https://s1.dmcdn.net/v/WQ-hm1clSFkSRH5V9/x240'} />
            </div>
          ))}
        </Slider>
      </div>

      {/* Mobile Scrollable List */}
      <div className="md:hidden">
        <div className="flex overflow-x-auto gap-4 md:pb-4 scrollbar-hide -mx-2 px-2">
          {data?.data?.list?.map(playlist => (
            <div key={playlist.id} className="flex-none w-[280px]">
              <DailymotionCard videoId={playlist.id} title={playlist.name} videoCount={playlist.videos_total} thumbnailUrl={playlist.thumbnail_240_url || 'https://s1.dmcdn.net/v/WQ-hm1clSFkSRH5V9/x240'} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
