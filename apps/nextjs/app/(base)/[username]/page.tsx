import { DEFAULT_PROFILE_IMAGE } from "constants/user";
import { getTweetsByUsername } from "utils/tweet";
import { getUserProfile } from "utils/user";
import { InfiniteUserTweets } from "./InfiniteUserTweets";

export default async function Profile({
  params: { username },
}: {
  params: { username: string };
}) {
  const [userProfile, tweets] = await Promise.all([
    getUserProfile(username),
    getTweetsByUsername(username),
  ]);
  return (
    <>
      {/** Tweets */}
      <div>
        <InfiniteUserTweets
          username={username}
          profileImage={userProfile?.profileImage ?? DEFAULT_PROFILE_IMAGE}
          name={userProfile?.name}
          initialTweets={tweets}
        />
      </div>
    </>
  );
}
