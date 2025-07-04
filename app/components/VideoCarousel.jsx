'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { ChevronRight, Loader2 } from 'lucide-react';
import HeadingText from './HeadingText';
import LazyImage from './LazyImage';
import Link from 'next/link';

// Dynamically import react-slick (client-only)
const Slider = dynamic(() => import('react-slick'), { ssr: false });

const CustomNextArrow = ({ onClick }) => (
  <div onClick={onClick} className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/30 hover:bg-white/50 text-black rounded-full w-9 h-9 flex items-center justify-center backdrop-blur-sm cursor-pointer">
    <ChevronRight className="w-6 h-6" />
  </div>
);

const CustomPrevArrow = ({ onClick }) => (
  <div onClick={onClick} className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/30 hover:bg-white/50 text-black rounded-full w-9 h-9 flex items-center justify-center backdrop-blur-sm cursor-pointer">
    <ChevronRight className="w-6 h-6 rotate-180" />
  </div>
);

const HoverPreviewCard = ({ video, slug, id }) => {
  // console.log('title' + video.title + ' id' + id);
  // console.log(video);

  const [showIframe, setShowIframe] = useState(false);
  const [timer, setTimer] = useState(null);
  const [hovered, setHovered] = useState(false);

  const minutes = Math.floor(video.duration / 60);
  const seconds = video.duration % 60;
  const formattedDuration = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const formattedDate = new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(video.created_time * 1000));

  const handleMouseEnter = () => {
    setHovered(true);
    const t = setTimeout(() => setShowIframe(true), 1000);
    setTimer(t);
  };

  const handleMouseLeave = () => {
    setHovered(false);
    clearTimeout(timer);
    setShowIframe(false);
  };

  return (
    <div className="cursor-pointer space-y-2" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <Link href={`/videos/${slug}/${id}/${video.id}`}>
        <div className="group relative w-full h-0 pt-[56.25%] overflow-hidden rounded shadow-md">
          {showIframe ? (
            <div className="absolute inset-0 pointer-events-none">
              <iframe src={`https://www.dailymotion.com/widget/preview/video/${video.id}?title=none&duration=none&mode=video&trigger=auto`} allow="autoplay" allowFullScreen className="w-full h-full" />
            </div>
          ) : (
            <div className="absolute inset-0">
              <div className="relative w-full h-full">
                <LazyImage src={video.thumbnail_240_url} alt={video.title} fill sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 20vw" className={`object-cover transition-all duration-300 ${hovered ? 'scale-105' : 'scale-100'}`} />
                <div className={`absolute inset-0 transition-all duration-300 flex items-center justify-center ${hovered ? 'bg-neutral-800/90' : 'bg-black/0'}`}>{hovered && <Loader2 className="w-8 h-8 text-yellow-300 animate-spin" />}</div>
              </div>
              <div className="absolute top-1 right-1 bg-black bg-opacity-75 text-white text-xs px-1 py-0.5 rounded z-10">{formattedDuration}</div>
            </div>
          )}
        </div>

        <div className="text-xs px-1">
          <div className="text-yellow-300 text-[13px] mb-2">{formattedDate}</div>
          <div className="text-[15px] text-yellow-400 font-medium leading-snug line-clamp-3">{video.title}</div>
        </div>
      </Link>
    </div>
  );
};

/////////////////////////////
// testing

////////////////////////////////

const VideoCarousel = ({ title, slug, data, id }) => {
  // console.log(data);
  // console.table(title + '-----' + id);
  // console.log(slug);

  const [isMobile, setIsMobile] = useState(false);

  const settings = {
    infinite: false,
    dots: false,
    slidesToShow: 5.2,
    slidesToScroll: 1,
    arrows: true,
    nextArrow: <CustomNextArrow />,
    prevArrow: <CustomPrevArrow />,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 640, settings: { slidesToShow: 1.8 } },
    ],
  };

  return (
    <div className="px-2 mb-14">
      <HeadingText name={title} link={slug} id={id} />

      {isMobile ? (
        <div className="flex space-x-2 overflow-x-auto scrollbar-hide mt-4">
          {data?.map(video => (
            <div key={video.id} className="min-w-[60%]">
              <HoverPreviewCard video={video} slug={slug} id={id} />
            </div>
          ))}
        </div>
      ) : (
        <div className="-mx-2 relative m-4">
          <Slider {...settings}>
            {data?.map(video => (
              <div key={video.id} className="px-3">
                <HoverPreviewCard video={video} slug={slug} id={id} />
              </div>
            ))}
          </Slider>
        </div>
      )}
    </div>
  );
};

export default VideoCarousel;
