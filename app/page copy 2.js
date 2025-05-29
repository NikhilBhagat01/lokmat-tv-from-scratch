import Featuredchannel from "./components/Featuredchannel";
import NewsLayout from "./components/NewsLayout";
import PlaylistCarousel from "./components/PlaylistCarousel";
import VideoCarousel from "./components/VideoCarousel";
import { fetchAllDailymotionData } from "./lib/FetchData";
import ClientCarouselsWrapper from "./components/ClientCarouselsWrapper"; // ✅ Now a client component
import { API_URL_DATA } from "./lib/apilist";
import { Suspense } from "react";

// Loading component for carousels
function CarouselSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-4 bg-gray-700 rounded w-1/4 mb-4"></div>
      <div className="grid grid-cols-5 gap-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="space-y-3">
            <div className="h-32 bg-gray-700 rounded"></div>
            <div className="h-3 bg-gray-700 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

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
      <Suspense fallback={<CarouselSkeleton />}>
        <NewsLayout
          data={topStories}
          title={topStoriesTitle}
          slug={topStoriesSlug}
        />
      </Suspense>

      <div className="pl-3 pb-3 text-yellow-400">
        {/* SSR part */}
        {ssrCarousels.map((item, index) => (
          <Suspense key={index} fallback={<CarouselSkeleton />}>
            {item?.isFeaturedChannel ? (
              <Featuredchannel data={item} />
            ) : item?.isPlaylist || item?.type ? (
              <PlaylistCarousel data={item} />
            ) : (
              <VideoCarousel
                title={item.title}
                slug={item.title_slug}
                data={item?.data || []}
              />
            )}
          </Suspense>
        ))}

        {/* CSR part - client-only rendering */}
        <Suspense fallback={<CarouselSkeleton />}>
          <ClientCarouselsWrapper carousels={csrCarousels} />
        </Suspense>
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