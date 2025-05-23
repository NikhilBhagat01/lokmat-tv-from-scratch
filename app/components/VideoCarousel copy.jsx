"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import HeadingText from "./HeadingText";

// Dynamically import react-slick (client-only)
const Slider = dynamic(() => import("react-slick"), { ssr: false });

const sampleData = [
  {
    id: 1,
    thumbnail: "https://s2.dmcdn.net/v/Y8_kK1e9Aock52MMy/x240",
    dailymotionId: "x9h0ql0",
    title: "Suresh Dhas Live",
    description:
      "Sharad Ponkshe : बीडमध्ये प्रयोग संपताच शरद पोंक्षेंच्या संतापाचा उद्रेक, कुणाकुणाला सुनावलं?",
    time: "423",
    date: "1739959989",
  },
  {
    id: 2,
    thumbnail: "https://s1.dmcdn.net/v/Xvzdm1e0HJvKcqkUD/x240",
    dailymotionId: "x9eo9v4",
    title: "समारोपाचं अभिनंदन",
    description:
      "Sharad Ponkshe : बीडमध्ये प्रयोग संपताच शरद पोंक्षेंच्या संतापाचा उद्रेक, कुणाकुणाला सुनावलं?",
    time: "423",
    date: "1739952910",
  },
  {
    id: 3,
    thumbnail: "https://s2.dmcdn.net/v/XhTg01e9AocVtwRS4/x240",
    dailymotionId: "x9cet1c",
    title: "समारोपाचं अभिनंदन",
    description:
      "Sharad Ponkshe : बीडमध्ये प्रयोग संपताच शरद पोंक्षेंच्या संतापाचा उद्रेक, कुणाकुणाला सुनावलं?",
    time: "423",
    date: "1738959989",
  },
  {
    id: 4,
    thumbnail: "https://s2.dmcdn.net/v/XhTg01e9AocVtwRS4/x240",
    dailymotionId: "x9b19t0",
    title: "समारोपाचं अभिनंदन",
    description:
      "Sharad Ponkshe : बीडमध्ये प्रयोग संपताच शरद पोंक्षेंच्या संतापाचा उद्रेक, कुणाकुणाला सुनावलं?",
    time: "423",
    date: "1739955989",
  },
  {
    id: 5,
    thumbnail: "https://s2.dmcdn.net/v/XhTg01e9AocVtwRS4/x240",
    dailymotionId: "x9b19t0",
    title: "समारोपाचं अभिनंदन",
    description:
      "Sharad Ponkshe : बीडमध्ये प्रयोग संपताच शरद पोंक्षेंच्या संतापाचा उद्रेक, कुणाकुणाला सुनावलं?",
    time: "423",
    date: "1739943989",
  },
  {
    id: 6,
    thumbnail: "https://s2.dmcdn.net/v/XhTg01e9AocVtwRS4/x240",
    dailymotionId: "x9b19t0",
    title: "समारोपाचं अभिनंदन",
    description:
      "Sharad Ponkshe : बीडमध्ये प्रयोग संपताच शरद पोंक्षेंच्या संतापाचा उद्रेक, कुणाकुणाला सुनावलं?",
    time: "423",
    date: "1739959989",
  },
  {
    id: 7,
    thumbnail: "https://s2.dmcdn.net/v/XhTg01e9AocVtwRS4/x240",
    dailymotionId: "x9b19t0",
    title: "समारोपाचं अभिनंदन",
    description:
      "Sharad Ponkshe : बीडमध्ये प्रयोग संपताच शरद पोंक्षेंच्या संतापाचा उद्रेक, कुणाकुणाला सुनावलं?",
    time: "423",
    date: "1739959920",
  },
  {
    id: 8,
    thumbnail: "https://s2.dmcdn.net/v/XhTg01e9AocVtwRS4/x240",
    dailymotionId: "x9b19t0",
    title: "समारोपाचं अभिनंदन",
    description:
      "Sharad Ponkshe : बीडमध्ये प्रयोग संपताच शरद पोंक्षेंच्या संतापाचा उद्रेक, कुणाकुणाला सुनावलं?",
    time: "423",
    date: "1739959989",
  },
];

const CustomNextArrow = ({ onClick }) => (
  <div
    onClick={onClick}
    className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/30 hover:bg-white/50 text-black rounded-full w-9 h-9 flex items-center justify-center backdrop-blur-sm cursor-pointer"
  >
    <ChevronRight className="w-6 h-6" />
  </div>
);

const CustomPrevArrow = ({ onClick }) => (
  <div
    onClick={onClick}
    className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/30 hover:bg-white/50 text-black rounded-full w-9 h-9 flex items-center justify-center backdrop-blur-sm cursor-pointer"
  >
    <ChevronRight className="w-6 h-6 rotate-180" />
  </div>
);

const HoverPreviewCard = ({ video }) => {
  const [showIframe, setShowIframe] = useState(false);
  const [timer, setTimer] = useState(null);
  const [hovered, setHovered] = useState(false);

  const minutes = Math.floor(video.time / 60);
  const seconds = video.time % 60;
  const formattedDuration = `${String(minutes).padStart(2, "0")}:${String(
    seconds
  ).padStart(2, "0")}`;

  const formattedDate = new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(video.date * 1000));

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
    <div
      className="cursor-pointer space-y-2"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="group relative w-full pt-[56.25%] overflow-hidden rounded shadow-md">
        {showIframe ? (
          <iframe
            src={`https://www.dailymotion.com/widget/preview/video/${video.dailymotionId}?title=none&duration=none&mode=video&trigger=auto`}
            allow="autoplay"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        ) : (
          <Image
            src={video.thumbnail}
            alt={video.title}
            fill
            sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 20vw"
            className="object-cover transition-transform duration-300"
          />
        )}

        {!showIframe && (
          <>
            <div
              className={`absolute inset-0 bg-black bg-opacity-60 transition-opacity duration-300 ${
                hovered ? "opacity-100" : "opacity-0"
              }`}
            />
            <div
              className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-opacity duration-300 ${
                hovered ? "opacity-100" : "opacity-0"
              }`}
            >
              <div className="w-8 h-8 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin" />
            </div>
            <div className="absolute top-1 right-1 bg-black bg-opacity-75 text-white text-xs px-1 py-0.5 rounded z-10">
              {formattedDuration}
            </div>
          </>
        )}
      </div>

      <div className="text-xs px-1">
        <div className="text-yellow-300 text-[13px] mb-2">{formattedDate}</div>
        <div className="text-[15px] text-yellow-400 font-medium leading-snug line-clamp-3">
          {video.description}
        </div>
      </div>
    </div>
  );
};

const VideoCarousel = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
    const checkScreen = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

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
      <HeadingText name="Trending Videos" link="/" />

      {hasMounted ? (
        isMobile ? (
          <div className="flex space-x-2 overflow-x-auto scrollbar-hide mt-4">
            {sampleData.map((video) => (
              <div key={video.id} className="min-w-[60%]">
                <HoverPreviewCard video={video} />
              </div>
            ))}
          </div>
        ) : (
          <div className="-mx-2 relative m-4">
            <Slider {...settings}>
              {sampleData.map((video) => (
                <div key={video.id} className="px-3">
                  <HoverPreviewCard video={video} />
                </div>
              ))}
            </Slider>
          </div>
        )
      ) : (
        // SSR fallback (just show thumbnails statically)
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mt-4">
          {sampleData.slice(0, 5).map((video) => (
            <div key={video.id}>
              <Image
                src={video.thumbnail}
                alt={video.title}
                width={320}
                height={180}
                className="rounded shadow"
              />
              <div className="text-xs mt-2 text-yellow-400 font-medium line-clamp-2">
                {video.description}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VideoCarousel;
