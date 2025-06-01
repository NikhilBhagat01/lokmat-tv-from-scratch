export const dynamic = "auto";
export const revalidate = 180; // Revalidate the page itself every 180 seconds (3 minutes)

import ExpandPlaylist from "@/app/components/ExpandPlaylist";
import NewsLayout from "@/app/components/NewsLayout";
import VideoCarousel from "@/app/components/VideoCarousel";
import { fetchCategoryDataBySlug } from "@/app/lib/FetchData";
import { redirect } from "next/navigation";

const page = async ({ params, searchParams }) => {
  const { slug } = await params;
  const { expand, videoId } = await searchParams;
  // console.log(await params)
  // console.log(expand)
  // console.log(videoId)

  if (expand && videoId) {
    return <ExpandPlaylist videoId={videoId} />;
  }
  // const data = await fetchCategoryData(slug);
  const data = await fetchCategoryDataBySlug(slug);
  // console.log("data", data);

  if (!data) return redirect("/");

  const firstPlaylist = data?.playlists[0] || [];
  const topStories = firstPlaylist?.videos || [];

  const topStoriesTitle = firstPlaylist.playlistName;
  const topStoriesSlug = firstPlaylist.slug;
  const topStoriesId = firstPlaylist.id;

  // console.log('topStoriesSlug',topStoriesSlug)
  return (
    <>
      {/* <h1>Video: {slug}</h1> */}
      {/* Debug information */}
      {/* <div className="p-4 bg-gray-100 mb-4">
        <h3 className="font-bold mb-2">Debug Info:</h3>
        <pre className="whitespace-pre-wrap">
          {JSON.stringify({
            categoryName: data.categoryName,
            playlistCount: data.playlists.length,
            firstPlaylist: {
              name: firstPlaylist.playlistName,
              videoCount: topStories.length,
              slug: topStoriesSlug
            },
            topStoriesData: topStories.slice(0,2) // Show first 2 videos
          }, null, 2)}
        </pre>
      </div> */}

      <NewsLayout
        data={topStories}
        title={topStoriesTitle}
        slug={topStoriesSlug}
        id={topStoriesId}
      />

      {data?.playlists?.slice(1).map((item, index) => (
        <VideoCarousel
          key={index}
          title={item.playlistName}
          slug={item.slug}
          data={item.videos}
        />
      ))}
    </>
  );
};

export default page;
