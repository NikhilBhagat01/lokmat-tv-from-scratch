export const dynamic = "auto"; // ISR + cached fetch every 3 minute
export const revalidate = 180; // Revalidate the page itself every 180 seconds (3 minutes)

import Featuredchannel from "./components/Featuredchannel";
import NewsLayout from "./components/NewsLayout";
import PlaylistCarousel from "./components/PlaylistCarousel";
import VideoCarousel from "./components/VideoCarousel";
import { fetchAllDailymotionData } from "./lib/FetchData";
import ClientCarouselsWrapper from "./components/ClientCarouselsWrapper"; //
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

// Error component for failed sections
function ErrorSection({ title, error }) {
  return (
    <div className="p-4 mb-4 bg-red-900/20 rounded-lg">
      <h3 className="text-red-500 font-medium mb-2">Failed to load {title}</h3>
      <p className="text-red-400 text-sm">{error}</p>
    </div>
  );
}

export default async function Home() {
  const data = await fetchAllDailymotionData();

  // Handle case where all fetches failed
  if (!data || data.length === 0) {
    return (
      <div className="p-8">
        <ErrorSection
          title="content"
          error="Unable to load any content. Please try again later."
        />
      </div>
    );
  }

  const topStories = data[0]?.data?.list || [];
  const topStoriesTitle = data[0]?.title;
  const topStoriesSlug = data[0]?.title_slug;

  const carousels = data.slice(1);

  // Split data
  const ssrCarousels = data.slice(1); // First three items for SSR
  const csrCarousels = API_URL_DATA.slice(3);

  return (
    <>
      <Suspense fallback={<CarouselSkeleton />}>
        {data[0]?.error ? (
          <ErrorSection title="top stories" error={data[0].error} />
        ) : (
          <NewsLayout
            data={topStories}
            title={topStoriesTitle}
            slug={topStoriesSlug}
          />
        )}
      </Suspense>

      <div className="pl-3 pb-3 text-yellow-400">
        {/* SSR part */}
        {ssrCarousels.map((item, index) => (
          <Suspense key={index} fallback={<CarouselSkeleton />}>
            {item?.error ? (
              <ErrorSection title={item.title} error={item.error} />
            ) : item?.isFeaturedChannel ? (
              <Featuredchannel data={item} />
            ) : item?.isPlaylist || item?.type ? (
              <PlaylistCarousel data={item} />
            ) : (
              <VideoCarousel
                title={item.title}
                slug={item.title_slug}
                data={item?.data?.list || []}
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
  try {
    const data = await fetchAllDailymotionData();
    const topStory = data[0]?.data?.list?.[0];

    return {
      title: topStory?.title || "Lokmat TV - Latest News & Videos",
      description:
        "Latest top stories and video content powered by Dailymotion.",
      openGraph: {
        title: topStory?.title || "Lokmat TV - Latest News & Videos",
        description: "Discover trending stories and video playlists.",
        url: "https://www.lokmat.com/videos",
        siteName: "LokmatTV",
        images: [
          {
            url:
              topStory?.thumbnail_240_url ||
              "https://yourdomain.com/og-image.jpg",
            width: 1200,
            height: 630,
          },
        ],
        locale: "en_US",
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: topStory?.title || "Lokmat TV - Latest News & Videos",
        description: "Watch trending news stories and playlists.",
        images: [
          topStory?.thumbnail_240_url ||
            "https://yourdomain.com/twitter-image.jpg",
        ],
      },
    };
  } catch (error) {
    // Fallback metadata if fetch fails
    return {
      title: "Lokmat TV - Latest News & Videos",
      description: "Latest news and video content from Lokmat TV.",
    };
  }
}
