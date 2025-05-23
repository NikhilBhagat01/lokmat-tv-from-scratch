import Featuredchannel from "./components/Featuredchannel";
import NewsLayout from "./components/NewsLayout";
import PlaylistCarousel from "./components/PlaylistCarousel";
import VideoCarousel from "./components/VideoCarousel";
import { fetchAllDailymotionData } from "./lib/FetchData";

export default async function Home() {
  const data = await fetchAllDailymotionData();
  const topStories = data[0]?.data?.list;
  // console.log(data);

  return (
    <>
      <NewsLayout data={topStories} />
      <div className="pl-3 pb-3 text-yellow-400">
        {data?.slice(1).map((item, index) => {
          console.log(item);
          if (item?.isFeaturedChannel) {
            return <Featuredchannel key={index} data={item} />;
          }

          if (item?.isPlaylist)
            return <PlaylistCarousel key={index} data={item} />;
          if (item?.type) return <PlaylistCarousel key={index} data={item} />;

          if (!item.type) return <VideoCarousel key={index} data={item} />;
        })}
        {/* <VideoCarousel /> */}
        {/* <PlaylistCarousel /> */}
        {/* <Featuredchannel /> */}
      </div>
    </>
  );
}
