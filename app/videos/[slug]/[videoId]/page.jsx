export const dynamic = 'auto';
export const revalidate = 180;

import ExpandPlaylist from '@/app/components/ExpandPlaylist';

const ExpandedVideoPage = async ({ params }) => {
  const { videoId } = params;

  return <ExpandPlaylist videoId={videoId} />;
};

export default ExpandedVideoPage;
