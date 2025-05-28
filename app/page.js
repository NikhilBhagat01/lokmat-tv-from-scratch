import Featuredchannel from "./components/Featuredchannel";
import NewsLayout from "./components/NewsLayout";
import PlaylistCarousel from "./components/PlaylistCarousel";
import VideoCarousel from "./components/VideoCarousel";
import { fetchAllDailymotionData } from "./lib/FetchData";
import ClientCarouselsWrapper from "./components/ClientCarouselsWrapper"; // ✅ Now a client component
import { API_URL_DATA } from "./lib/apilist";

export default async function Home() {
  const data = await fetchAllDailymotionData();

// console.table(data)
  const topStories = data[0]?.data?.list;
  const topStoriesTitle = data[0]?.title;
  const topStoriesSlug = data[0]?.title_slug;

  const carousels = data.slice(1);

  // Split data
  const ssrCarousels = data.slice(1); // First three items for SSR
  const csrCarousels = API_URL_DATA.slice(3);

  // console.table(ssrCarousels)
  return (
    <>
      <NewsLayout data={topStories} title={topStoriesTitle} slug={topStoriesSlug} />

      <div className="pl-3 pb-3 text-yellow-400">
        {/* SSR part */}
        {ssrCarousels.map((item, index) => {
          // console.log(item)
          if (item?.isFeaturedChannel) {
            return <Featuredchannel key={index} data={item} />;
          }

          if (item?.isPlaylist || item?.type) {
            return <PlaylistCarousel key={index} data={item} />;
          }

          if (!item?.type) {
            return (
              <VideoCarousel
                key={index}
                title={item.title}
                slug={item.title_slug}
                // id={item.id}
                data={item?.data || []} // Ensure data is an array
              />
            );
          }

          return null;
        })}

        {/* CSR part - client-only rendering */}
        <ClientCarouselsWrapper carousels={csrCarousels} />
      </div>
    </>
  );
}



export async function generateMetadata() {
  const data = await fetchAllDailymotionData();
  const topStory = data[0].data.list[0];

    // console.log(topStory)

  return {
    title: topStory?.title || "Your Site Default Title",
    description: "Latest top stories and video content powered by Dailymotion.",
    openGraph: {
      title: topStory?.title || "Default OG Title",
      description: "Discover trending stories and video playlists.",
      url: "https://www.lokmat.com/videos",
      siteName: "LokmatTV",
      images: [
        {
          url: "https://yourdomain.com/og-image.jpg",
          width: 1200,
          height: 630,
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: topStory?.title || "Twitter Title",
      description: "Watch trending news stories and playlists.",
      images: ["https://yourdomain.com/twitter-image.jpg"],
    },
  };
}