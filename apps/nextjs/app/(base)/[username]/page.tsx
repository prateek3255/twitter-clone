import { DEFAULT_PROFILE_IMAGE } from "constants/user";
import { getTweetsByUsername } from "utils/tweet";
import { getCurrentLoggedInUser, getUserProfile } from "utils/user";
import { InfiniteUserTweets } from "./components/InfiniteUserTweets";

export default async function Profile({
  params: { username },
}: {
  params: { username: string };
}) {
  const [userProfile, tweets, currentLoggedInUser] = await Promise.all([
    getUserProfile(username),
    getTweetsByUsername(username),
    getCurrentLoggedInUser(),
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
          currentLoggedInUser={
            currentLoggedInUser
              ? {
                  id: currentLoggedInUser.id,
                  username: currentLoggedInUser.username,
                  name: currentLoggedInUser.name ?? undefined,
                  profileImage: currentLoggedInUser.profileImage,
                }
              : undefined
          }
        />
      </div>
    </>
  );
}
