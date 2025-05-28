import React from "react";

// Sample data
const Featuredchannels = [
  {
    id: "x2jo5vs",
    cover_250_url: "https://s1.dmcdn.net/b/9BMx81eBh9SzWLRLC/x250",
    avatar_60_url: "https://s1.dmcdn.net/u/9BMx81eBh9SEsjS8M/60x60",
    url: "https://www.dailymotion.com/LokmatSakhi",
    screenname: "Lokmat Sakhi",
  },
  {
    id: "x2jo5vm",
    cover_250_url: "https://s1.dmcdn.net/b/9BMx21eBjztUOeLE-/x250",
    avatar_60_url: "https://s1.dmcdn.net/u/9BMx21eBjztwQrM0l/60x60",
    url: "https://www.dailymotion.com/LokmatBhakti",
    screenname: "Lokmat Bhakti",
  },
  {
    id: "x2jo5oz",
    cover_250_url: "https://s1.dmcdn.net/b/9BMtJ1e0HJF-HSUeW/x250",
    avatar_60_url: "https://s1.dmcdn.net/u/9BMtJ1e0HJFOApNs1/60x60",
    url: "https://www.dailymotion.com/LokmatFilmy",
    screenname: "Lokmat Filmy",
  },
];

const FeaturedCard = ({ channel }) => {
  return (
    <a
      href={channel.url}
      target="_blank"
      rel="noopener noreferrer"
      className="relative shrink-0 rounded-lg w-48 h-40 sm:w-60 md:w-64  md:h-64 bg-no-repeat bg-center bg-cover mx-2"
      // style={{ backgroundImage: `url(${channel.cover_250_url})` }}
      style={{
        backgroundImage: `url('https://d3pc1xvrcw35tl.cloudfront.net/images/2022/07/854207/sakhi-dm-channel.jpg')`,
      }}
    >
      <div className="absolute bottom-0 w-full h-[40%] bg-gradient-to-t from-black/70 to-transparent">
        <div className="h-full flex items-end justify-center pb-2">
          <div className="text-center">
            <img
              className="mx-auto mb-1 w-10 h-10 "
              src={channel.avatar_60_url}
              alt={channel.screenname}
            />
            <h3 className="text-white font-bold text-sm">
              {channel.screenname}
            </h3>
          </div>
        </div>
      </div>
    </a>
  );
};

const Featuredchannel = ({ data }) => {
  // console.log(data);
  return (
    <div className="px-4 mb-14">
      <h3 className="text-xl md:text-2xl font-semibold mb-4">
        Featured Channels
      </h3>

      {/* Horizontal scroll container */}
      <div className="flex overflow-x-auto md:overflow-x-visible scrollbar-hide md:flex-wrap ">
        {Featuredchannels.map((channel) => (
          <FeaturedCard key={channel.id} channel={channel} />
        ))}
      </div>
    </div>
  );
};

export default Featuredchannel;
