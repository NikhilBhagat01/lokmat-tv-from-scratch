// import NewsLayout from "@/app/components/NewsLayout";
// import React from "react";

import NewsLayout from "@/app/components/NewsLayout";
import VideoCarousel from "@/app/components/VideoCarousel";
import { CATEGORY_DATA } from "@/app/lib/apilist";
import { fetchCategoryData, fetchCategoryDataBySlug } from "@/app/lib/FetchData";

// import { API_URL_DATA, CATEGORY_DATA, CITY_DATA } from "@/app/lib/apilist";


// const page = async({ params }) => {
//   const { slug } = await params;
//   console.log(slug);

//   const category = CATEGORY_DATA.find(item => item.slug === slug);
//   const city = CITY_DATA.find(item => item.slug === slug);
//   console.log(category, city)

//   const playlist = category.playlist.split(',');

//   // const category = CATEGORY_DATA.find(item => item.slug === slug);
//   // const city = CITY_DATA.find(item => item.slug === slug);
//   // console.log(category, city)
//   return

//   return (
//     <div>
//       <NewsLayout />
//     </div>
//   );
// };

// export default page;






const page = async({ params }) => {
  const { slug } = await params;
  // const data = await fetchCategoryData(slug);
  const data = await fetchCategoryDataBySlug(slug)
  console.log('data',data)


  if(!data) return <h1>No Data</h1>

const firstPlaylist = data?.playlists[0] || [];
  const topStories =firstPlaylist?.videos || [];

  const topStoriesTitle = firstPlaylist.playlistName;
  const topStoriesSlug = firstPlaylist.slug

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
          />

        {data?.playlists?.slice(1).map((item,index)=>(
          <VideoCarousel
            key={index}
            title={item.playlistName}
            slug={item.slug}
            data={item.videos}
          />
        ))}


                  {/* <VideoCarousel
                title={item.title}
                slug={item.title_slug}
                data={item?.data?.list || []}
              /> */}
    </>
  );
};

export default page;
