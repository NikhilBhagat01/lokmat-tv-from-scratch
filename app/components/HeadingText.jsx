import { ChevronRight } from "lucide-react";
import Link from "next/link";
import React from "react";

const HeadingText = ({ name, link, id }) => {
  // console.log(link);
  const href = id ? `/videos/${link}/${id}` : `/videos/${link}`;
  return (
    <div className="flex items-center gap-4 px-3">
      <h3 className="text-[23px] font-semibold">{name}</h3>
      <Link
        href={href}
        className="flex items-center gap-1 cursor-pointer hover:text-yellow-400 transition"
      >
        <span className="text-[12px]">Explore All</span>
        <ChevronRight size={"10px"} />
      </Link>
    </div>
  );
};

export default HeadingText;
