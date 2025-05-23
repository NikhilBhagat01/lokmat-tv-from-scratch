import React from "react";

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

const FeaturedCard = () => {
  return (
    <div className="relative rounded-lg h-64 w-64 ml-3 bg-no-repeat bg-center bg-cover   bg-[url('https://d3pc1xvrcw35tl.cloudfront.net/images/2022/07/854207/sakhi-dm-channel.jpg')]">
      <div className="w-full  bottom-0 absolute h-[40%]">
        <div className=" h-full">
          <div className="w-[40%]  mx-auto h-full text-center">
            {/* image */}
            <img
              className="mx-auto "
              src="https://s1.dmcdn.net/u/9BMx81eBh9SEsjS8M/60x60"
              alt="Lokmat Sakhi"
            />
            {/* text */}
            <h3 className="text-white font-bold text-[14px]">Lokmat Sakhi</h3>
          </div>
        </div>
      </div>
    </div>
  );
};

const Featuredchannel = () => {
  return (
    <div className="px-2 mb-14">
      <h3 className="text-[23px] font-semibold mb-3 px-3 ">
        Featured Channels
      </h3>
      <div className="flex flex-col md:flex-row">
        <FeaturedCard />
        <FeaturedCard />
        <FeaturedCard />
      </div>
    </div>
  );
};

export default Featuredchannel;
