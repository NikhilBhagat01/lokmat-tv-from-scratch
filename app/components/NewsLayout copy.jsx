"use client";

import React, { useEffect, useRef, useState } from "react";
import Slider from "react-slick";
import { ChevronLeft, ChevronRight } from "lucide-react";
import HeadingText from "./HeadingText";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const newsItems = [
  {
    img: "https://s1.dmcdn.net/v/YN7X61e9AhsWdKdN1/x240",
    title:
      "या चार लोकांमुळे २५ कोटी लोक धोक्यात… पाकिस्तानला कोण बुडवतंय? Pakistan's Enemies",
    vidId: "x9j830m",
  },
  {
    img: "https://s1.dmcdn.net/v/YN6yg1e9AgmPdaGXd/x240",
    title: "सोफिया कुरेशींनी पाकचा लबाडपणा उघड केला_1",
    vidId: "x9j817u",
  },
  {
    img: "https://s2.dmcdn.net/v/YN6NE1e7r0Sz2-ipG/x240",
    title: "सरपंचानं सगळ्यांना हैराण करुन सोडलं, एक आंदोलन राज्यभर का गाजलं?",
    vidId: "x9j7zda",
  },
  {
    img: "https://s1.dmcdn.net/v/YN62k1e8nJ9F9FuMN/x240",
    title:
      "S400 Air Defence System : दिवंगत मनोहर पर्रीकर यांचा तो एक निर्णय, भारताची ताकद कशी वाढली? SA3",
    vidId: "x9j7ycu",
  },
  {
    img: "https://s1.dmcdn.net/v/YN5ri1e7ZgKGchoIZ/x240",
    title:
      "...जेव्हा पाकला रवीना टंडनकडून मिसाईल पाठवण्यात आलेलं, काय घडलेलं? Raveena Tandon Missile Story",
    vidId: "x9j7xpo",
  },
  {
    img: "https://s2.dmcdn.net/v/YN56g1e8c9SSrufvX/x240",
    title: "बदला पूर्ण झाला मेहबुबा मुफ्ती रडल्या मोदींना विनंती काय",
    vidId: "x9j7ve2",
  },
  {
    img: "https://s1.dmcdn.net/v/YM_C-1e7XhpTxkXTF/x240",
    title:
      "अंगावर अक्षदा पडताच जवानाला सीमेवर हजर राहण्याचे आदेश | Orders To Appear At The Border",
    vidId: "x9j7cqm",
  },
];

const CustomPrevArrow = ({ onClick }) => (
  <div
    onClick={onClick}
    className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/30 hover:bg-white/50 text-white rounded-full w-9 h-9 flex items-center justify-center backdrop-blur-sm cursor-pointer"
  >
    <ChevronLeft className="w-5 h-5" />
  </div>
);

const CustomNextArrow = ({ onClick }) => (
  <div
    onClick={onClick}
    className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/30 hover:bg-white/50 text-white rounded-full w-9 h-9 flex items-center justify-center backdrop-blur-sm cursor-pointer"
  >
    <ChevronRight className="w-5 h-5" />
  </div>
);

export default function NewsLayout({ data }) {
  const [selectedItem, setSelectedItem] = useState(data[0]);
  const [showVideo, setShowVideo] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [slidesToShow, setSlidesToShow] = useState(7);
  const [isMobile, setIsMobile] = useState(false);
  const sliderRef = useRef(null);

  // Responsive settings
  useEffect(() => {
    const updateSlidesToShow = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      if (width < 768) {
        setSlidesToShow(1.2);
      } else if (width < 1024) {
        setSlidesToShow(3);
      } else {
        setSlidesToShow(7);
      }
    };
    updateSlidesToShow();
    window.addEventListener("resize", updateSlidesToShow);
    return () => window.removeEventListener("resize", updateSlidesToShow);
  }, []);

  // Auto-play logic: show image > after 2s play video > after 5s go to next
  useEffect(() => {
    if (isMobile) return;

    setShowVideo(false); // Show image first

    const videoTimer = setTimeout(() => {
      setShowVideo(true); // Then play video
    }, 2000);

    const advanceTimer = setTimeout(() => {
      const nextIndex = (activeSlide + 1) % newsItems.length;
      setActiveSlide(nextIndex);
      setSelectedItem(newsItems[nextIndex]);
      sliderRef.current?.slickGoTo(nextIndex);
    }, 10000);

    return () => {
      clearTimeout(videoTimer);
      clearTimeout(advanceTimer);
    };
  }, [activeSlide, isMobile]);

  const settings = {
    infinite: false,
    speed: 500,
    slidesToShow,
    slidesToScroll: 1,
    arrows: false,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 1.2 } },
    ],
  };

  return (
    <div className="bg-black text-yellow-400 px-4 md:pt-[43px] font-sans md:mb-6">
      {/* Top Section */}
      <div className="flex flex-col md:flex-row-reverse items-center gap-4 mb-8 md:max-h-[400px] relative">
        {/* Video or Image */}
        <div className="w-full md:w-3/5">
          <div className="w-full aspect-video rounded-lg overflow-hidden">
            {showVideo ? (
              <iframe
                src={`https://www.dailymotion.com/widget/preview/video/${selectedItem.vidId}?title=none&duration=none&mode=video&trigger=auto`}
                title="Dailymotion Video"
                allowFullScreen
                loading="lazy"
                className="w-full h-full"
              />
            ) : (
              <img
                src={selectedItem.img}
                alt="Press"
                loading="lazy"
                className="w-full h-full object-cover"
              />
            )}
          </div>
        </div>

        {/* Text */}
        <div className="w-full md:w-2/5 md:text-left ">
          <h2 className="text-xl md:text-2xl font-bold mb-4  ">
            {selectedItem.title}
          </h2>
          <button
            className="bg-yellow-400 text-black px-4 py-2 rounded hover:bg-yellow-300 font-semibold"
            onClick={() => console.log("Autoplay controls video")}
          >
            <svg
              className="w-5 h-5 inline-block "
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M6 4l10 6-10 6V4z" />
            </svg>
            Play
          </button>
        </div>
      </div>

      {/* Carousel / List */}
      <HeadingText name="Top Stories Today" link="/" />
      <div className="relative">
        {!isMobile ? (
          <>
            {activeSlide > 0 && (
              <CustomPrevArrow onClick={() => sliderRef.current?.slickPrev()} />
            )}
            {activeSlide < newsItems.length - slidesToShow && (
              <CustomNextArrow onClick={() => sliderRef.current?.slickNext()} />
            )}
            <Slider ref={sliderRef} {...settings}>
              {newsItems.map((item, idx) => (
                <div key={idx} className="px-2">
                  <div
                    onClick={() => {
                      setSelectedItem(item);
                      setActiveSlide(idx);
                      setShowVideo(false); // Restart cycle on click
                    }}
                    className={`cursor-pointer bg-neutral-900 text-white p-2 rounded-lg ${
                      idx === activeSlide ? "border-4 border-yellow-400" : ""
                    }`}
                  >
                    <img
                      src={item.img}
                      alt={item.title}
                      className="w-full aspect-video object-cover rounded-md"
                    />
                  </div>
                </div>
              ))}
            </Slider>
          </>
        ) : (
          <div className="flex overflow-x-auto space-x-4 px-2">
            {newsItems.map((item, idx) => (
              <div
                key={idx}
                onClick={() => {
                  setSelectedItem(item);
                  setActiveSlide(idx);
                  setShowVideo(false);
                }}
                className={`cursor-pointer bg-neutral-900 text-white p-2 rounded-lg flex-shrink-0 w-[80%] ${
                  idx === activeSlide ? "border-4 border-yellow-400" : ""
                }`}
              >
                <img
                  src={item.img}
                  alt={item.title}
                  className="w-full aspect-video object-cover rounded-md"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
