'use client';

import { useEffect, useRef, useState } from 'react';

import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, CircleChevronDown, ArrowLeft, House } from 'lucide-react';
import Link from 'next/link';

const NavLinks = [
  { name: 'News', link: '/videos/news' },
  { name: 'City News', link: '/videos/city-news' },
  { name: 'Entertainment', link: '/videos/entertainment' },
  { name: 'Social Viral', link: '/videos/social-viral' },
  { name: 'Sakhi', link: '/videos/sakhi' },
  { name: 'Bhakti', link: '/videos/bhakti' },
  { name: 'Events', link: '/videos/events' },
  { name: 'Inspirational', link: '/videos/inspirational' },
];

const cityLinks = [
  {
    name: 'Hello Pune',
    link: 'https://www.lokmat.com/videos/?expand=customized+title%3Dvideo_playlist%28x7h72r%29',
  },
  {
    name: 'Hello Mumbai',
    link: 'https://www.lokmat.com/videos/?expand=customized+title%3Dvideo_playlist%28x7h731%29',
  },
  {
    name: 'Hello Thane',
    link: 'https://www.lokmat.com/videos/?expand=customized+title%3Dvideo_playlist%28x7h73p%29',
  },
  {
    name: 'Hello Kalyan Dombivili',
    link: 'https://www.lokmat.com/videos/?expand=customized+title%3Dvideo_playlist%28x7h73v%29',
  },
  {
    name: 'Hello Nagpur',
    link: 'https://www.lokmat.com/videos/?expand=customized+title%3Dvideo_playlist%28x7h73x%29',
  },
  {
    name: 'Hello Chhatrapati Sambhajinagar',
    link: 'https://www.lokmat.com/videos/?expand=customized+title%3Dvideo_playlist%28x7h73y%29',
  },
  {
    name: 'Hello Nashik',
    link: 'https://www.lokmat.com/videos/?expand=customized+title%3Dvideo_playlist%28x7h74c%29',
  },
  {
    name: 'Hello Kolhapur',
    link: 'https://www.lokmat.com/videos/?expand=customized+title%3Dvideo_playlist%28x7h74l%29',
  },
  {
    name: 'Hello Jalgaon',
    link: 'https://www.lokmat.com/videos/?expand=customized+title%3Dvideo_playlist%28x7h74t%29',
  },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCityOpen, setIsCityOpen] = useState(false);

  const toggleCityMenu = () => {
    setIsCityOpen(prev => !prev);
  };

  return (
    <header id="headerwrapper" className="fixed w-full left-0 top-0 z-20">
      <div className="headstrip h-12   flex items-center justify-between px-1 md:h-24  bg-[url('https://d3pc1xvrcw35tl.cloudfront.net/assets/images/dm-video-tiles/headerbg_mobile-v0.0.jpg')] bg-no-repeat bg-[length:100%] bg-[position:0_0] md:bg-[url('https://d3pc1xvrcw35tl.cloudfront.net/assets/images/dm-video-tiles//headerbg_desktop-v0.0.jpg')]">
        <div className="headerleft flex flex-2/3 items-center w-full gap-2.5 md:pl-11">
          <button className="hamburger-icon-button md:hidden" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
            {isOpen ? <X size={28} color="white" /> : <Menu size={28} color="white" />}
          </button>

          <Link href="/" className="flex justify-center items-center mt-[8px] ">
            <img className="w-[123px] h-[39px] md:w-52 md:h-16" src="https://d3pc1xvrcw35tl.cloudfront.net/assets/images/dm-video-tiles/lokmattv-logo-v0.0.png" alt="Lokmat TV" />
          </Link>
        </div>

        <div className="headerright  md:pr-4">
          <div className="backtolokmat hidden  md:flex md:justify-center md:items-center md:gap-1 md:bg-white md:px-1 md:rounded-full ">
            <ArrowLeft size={20} color="black" />
            <Link href="/" className="text-sm text-black font-bold px-2 py-1 rounded-md">
              Back to <span className="md:inline text-red-600">Lokmat</span>.com
            </Link>
          </div>

          {/* working */}
          <div className="btnselectcity relative bg-white text-black rounded-full px-2 py-1 flex items-center md:gap-1 md:hidden cursor-pointer" onClick={toggleCityMenu}>
            <span className="text-sm text-black font-bold px-2 rounded-md z-10">Select City</span>
            <CircleChevronDown size={20} color="black" />

            <AnimatePresence>
              {isCityOpen && (
                <motion.div
                  key="citylist"
                  initial={{ opacity: 0, maxHeight: 0, width: 0, y: -10 }}
                  animate={{ opacity: 1, maxHeight: 400, width: 285, y: 0 }}
                  exit={{ opacity: 0, maxHeight: 0, width: 0, y: -10 }}
                  transition={{
                    duration: 0.5,
                    ease: [0.25, 0.8, 0.25, 1],
                  }}
                  className="cityWrap absolute top-8 right-0 bg-white rounded-md shadow-lg pt-2 overflow-hidden will-change-transform z-50"
                >
                  <ul className="cityList whitespace-nowrap overflow-hidden text-ellipsis">
                    {cityLinks.map((city, key) => (
                      <li className="cityItem pl-2 pb-2" key={key}>
                        <Link href={`/${city.link}`} className="block max-w-full overflow-hidden text-ellipsis whitespace-nowrap" title={city.name}>
                          {city.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
      {/* navwrapper */}
      <nav className="navwrapper md:flex md:justify-between md:pr-7 bg-[#121212] text-amber-400">
        <ul className="navList flex items-center gap-4 whitespace-nowrap px-2  text-md md:text-lg overflow-x-auto sm:overflow-visible leading-6 md:px-12">
          <li className="navitem p-1">
            <Link href="/">
              <House size={18} color="gold" />
            </Link>
          </li>

          {NavLinks.map((link, key) => (
            <li className="navitem p-1" key={key}>
              <Link href={link.link}>{link.name}</Link>
            </li>
          ))}
        </ul>
        <div className="nav-right md:py-2">
          <div className="btnselectcity relative bg-white text-black rounded-full px-2 py-1 md:flex md:items-center md:gap-1 hidden cursor-pointer" onClick={toggleCityMenu}>
            <span className="text-sm text-black font-bold px-2 rounded-md z-10">Select City</span>
            <CircleChevronDown size={20} color="black" />

            <AnimatePresence>
              {isCityOpen && (
                <motion.div
                  key="citylist"
                  initial={{ opacity: 0, maxHeight: 0, width: 0, y: -10 }}
                  animate={{ opacity: 1, maxHeight: 400, width: 285, y: 0 }}
                  exit={{ opacity: 0, maxHeight: 0, width: 0, y: -10 }}
                  transition={{
                    duration: 0.5,
                    ease: [0.25, 0.8, 0.25, 1],
                  }}
                  className="cityWrap absolute top-8 right-0 bg-white rounded-md shadow-lg pt-2 overflow-hidden will-change-transform z-50"
                >
                  <ul className="cityList whitespace-nowrap overflow-hidden text-ellipsis">
                    {cityLinks.map((city, key) => (
                      <li className="cityItem pl-2 pb-2" key={key}>
                        <Link href={`/${city.link}`} className="block max-w-full overflow-hidden text-ellipsis whitespace-nowrap" title={city.name}>
                          {city.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </nav>

      {/* drawerMenu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Drawer sliding from below header (top-14 = 56px = 3.5rem) */}
            <motion.div
              key="drawer"
              initial={{ opacity: 0, x: '-100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: '-100%' }}
              transition={{
                duration: 0.5,
                ease: [0.25, 0.8, 0.25, 1], // easeInOut-like
              }}
              className="fixed top-14 left-0 w-full h-[calc(100vh-3.5rem)] bg-black z-30 shadow-md"
            >
              <div className="drawertop flex flex-col gap-2 px-2">
                {/* Back to Lokmat: right aligned below nav */}
                <div className="backtolokmat self-end flex items-center px-2 bg-white rounded-full w-max">
                  <ArrowLeft size={20} color="black" />
                  <Link href="/" className="text-sm text-black font-bold px-2 py-1 rounded-md">
                    Back to <span className="md:inline text-red-600">Lokmat</span>.com
                  </Link>
                </div>
                {/* Nav list: vertical stack */}
                <ul className="navList flex flex-col gap-1 max-h-screen overflow-y-auto">
                  {NavLinks.map((link, key) => (
                    <li className="navitem py-2 px-[18px] bg-[linear-gradient(to_bottom,_#000000_0%,_#141414_10%)] text-[16px] font-medium" key={key}>
                      <Link href={link.link}>{link.name}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
