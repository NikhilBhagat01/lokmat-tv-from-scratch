import Featuredchannel from "./components/Featuredchannel";
import NewsLayout from "./components/NewsLayout";
import PlaylistCarousel from "./components/PlaylistCarousel";
import VideoCarousel from "./components/VideoCarousel";
import { fetchAllDailymotionData } from "./lib/FetchData";

export default async function Home() {
  const data = await fetchAllDailymotionData();
  // console.log(data)
  const topStories = data[0]?.data?.list;
  const topStoriesTitle = data[0]?.title;
  // console.log(topStoriesTitle)
  const topStoriesSlug = data[0]?.title_slug;
  // console.log(topStoriesSlug);

  return (
    <>
      <NewsLayout data={topStories}  title={topStoriesTitle}  slug={topStoriesSlug}/>
      <div className="pl-3 pb-3 text-yellow-400">
        {data?.slice(1).map((item, index) => {
          console.log(item);
          if (item?.isFeaturedChannel) {
            return <Featuredchannel key={index} data={item}  />;
          }

          if (item?.isPlaylist)
            return <PlaylistCarousel key={index} data={item} />;
          if (item?.type) return <PlaylistCarousel key={index} data={item} />;

          if (!item.type) return <VideoCarousel key={index} title={item.title} slug={item.title_slug} id={item.id} />;
        })}
        {/* <VideoCarousel /> */}
        {/* <PlaylistCarousel /> */}
        {/* <Featuredchannel /> */}
      </div>
    </>
  );
}
