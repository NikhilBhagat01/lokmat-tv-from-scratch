"use client";

import { useEffect, useRef, useState } from "react";

import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, CircleChevronDown, ArrowLeft, House } from "lucide-react";
import Link from "next/link";

const NavLinks = [
  { name: "News", link: "/news" },
  { name: "City News", link: "/city-news" },
  { name: "Entertainment", link: "/entertainment" },
  { name: "Social Viral", link: "/social-viral" },
  { name: "Sakhi", link: "/sakhi" },
  { name: "Bhakti", link: "/bhakti" },
  { name: "Events", link: "/events" },
  { name: "Inspirational", link: "/inspirational" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCityOpen, setIsCityOpen] = useState(false);

  const toggleCityMenu = () => {
    setIsCityOpen((prev) => !prev);
  };

  console.log(isCityOpen);
  return (
    <header id="headerwrapper" className="fixed w-full left-0 top-0 z-20 ">
      <div className="headstrip h-12   flex items-center justify-between px-1 md:h-24  bg-[url('https://d3pc1xvrcw35tl.cloudfront.net/assets/images/dm-video-tiles/headerbg_mobile-v0.0.jpg')] bg-no-repeat bg-[length:100%] bg-[position:0_0] md:bg-[url('https://d3pc1xvrcw35tl.cloudfront.net/assets/images/dm-video-tiles//headerbg_desktop-v0.0.jpg')]">
        <div className="headerleft flex flex-2/3 items-center w-full gap-2.5 md:pl-11">
          <button
            className="hamburger-icon-button md:hidden"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <X size={28} color="white" />
            ) : (
              <Menu size={28} color="white" />
            )}
          </button>

          <a href="/" className="flex justify-center items-center mt-[8px] ">
            <img
              className="w-[123px] h-[39px] md:w-52 md:h-16"
              src="https://d3pc1xvrcw35tl.cloudfront.net/assets/images/dm-video-tiles/lokmattv-logo-v0.0.png"
              alt="Lokmat TV"
            />
          </a>
        </div>

        <div className="headerright  md:pr-4">
          <div className="backtolokmat hidden  md:flex md:justify-center md:items-center md:gap-1 md:bg-white md:px-1 md:rounded-full ">
            <ArrowLeft size={20} color="black" />
            <Link
              href="/"
              className="text-sm text-black font-bold px-2 py-1 rounded-md"
            >
              Back to <span className="md:inline text-red-600">Lokmat</span>.com
            </Link>
          </div>

          {/* working */}
          <div
            className="btnselectcity relative bg-white text-black rounded-full px-2 py-1 flex items-center md:gap-1 md:hidden cursor-pointer"
            onClick={toggleCityMenu}
          >
            <span className="text-sm text-black font-bold px-2 rounded-md z-10">
              Select City
            </span>
            <CircleChevronDown size={20} color="black" />

            <AnimatePresence>
              {isCityOpen && (
                <motion.div
                  layout
                  initial={{ opacity: 0, height: 0, width: 0 }}
                  animate={{ opacity: 1, height: "auto", width: 285 }}
                  exit={{ opacity: 0, height: 0, width: 0 }}
                  transition={{ duration: 0.3 }}
                  className="cityWrap absolute top-8 right-0 bg-white rounded-md shadow-lg overflow-hidden"
                >
                  cities
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
      {/* navwrapper */}
      <nav className="navwrapper md:flex md:justify-between md:pr-7 ">
        <ul className="navList flex items-center gap-4 whitespace-nowrap px-2  text-md md:text-lg overflow-x-auto sm:overflow-visible leading-6 md:px-12">
          <li className="navitem p-1">
            <Link href="/videos/">
              <House size={18} color="gold" />
            </Link>
          </li>

          {NavLinks.map((link, key) => (
            <li className="navitem p-1" key={key}>
              <Link href={link.link}>{link.name}</Link>
            </li>
          ))}
        </ul>
        <div className="nav-right md:py-1">
          <div
            className="btnselectcity relative bg-white text-black rounded-full px-2 py-1 md:flex md:items-center md:gap-1 hidden cursor-pointer"
            onClick={toggleCityMenu}
          >
            <span className="text-sm text-black font-bold px-2 rounded-md z-10">
              Select City
            </span>
            <CircleChevronDown size={20} color="black" />

            <AnimatePresence>
              {isCityOpen && (
                <motion.div
                  layout
                  initial={{ opacity: 0, height: 0, width: 0 }}
                  animate={{ opacity: 1, height: "auto", width: 285 }}
                  exit={{ opacity: 0, height: 0, width: 0 }}
                  transition={{ duration: 0.3 }}
                  className="cityWrap absolute md:top-8 right-0 bg-white rounded-md shadow-lg overflow-hidden"
                >
                  cities
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
