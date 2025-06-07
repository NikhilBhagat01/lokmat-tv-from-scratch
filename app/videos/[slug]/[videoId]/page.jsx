export const dynamic = 'auto';
export const revalidate = 180;

import ExpandPlaylist from '@/app/components/ExpandPlaylist';

const ExpandedVideoPage = async ({ params }) => {
  const { videoId, slug } = await params;

  return <ExpandPlaylist videoId={videoId} slug={slug} />;
};

export default ExpandedVideoPage;
