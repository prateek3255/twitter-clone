import { DEFAULT_PROFILE_IMAGE } from "constants/user";
import { getTweetsByUsername } from "utils/tweet";
import { getUserProfile } from "utils/user";
import { InfiniteUserTweets } from "./components/InfiniteUserTweets";
import { getUserId, isAuthenticated } from "utils/auth";

export default async function Profile({
  params: { username },
}: {
  params: { username: string };
}) {
  const [userProfile, tweets] = await Promise.all([
    getUserProfile(username),
    getTweetsByUsername(username),
  ]);

  let currentLoggedInUserId: undefined | string = undefined;
  if(isAuthenticated()) {
    currentLoggedInUserId = getUserId();
  }

  return (
    <>
      {/** Tweets */}
      <div>
        <InfiniteUserTweets
          currentLoggedInUserId={currentLoggedInUserId}
          username={username}
          profileImage={userProfile?.profileImage ?? DEFAULT_PROFILE_IMAGE}
          name={userProfile?.name}
          initialTweets={tweets}
        />
      </div>
    </>
  );
}
