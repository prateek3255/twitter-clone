import { getUserLikes } from "utils/tweet";
import { getCurrentLoggedInUser } from "utils/user";
import { InfiniteTweets } from "components/InfiniteTweets";
import { Metadata, ResolvingMetadata } from "next";

export async function generateMetadata(
  _: unknown,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const resolvingParent = await parent;

  return {
    title: `Tweeets liked by ${
      resolvingParent.title?.absolute ?? ""
    } | Twitter Clone`,
  };
}

export default async function UserLikes({
  params: { username },
}: {
  params: { username: string };
}) {
  const [tweets, currentLoggedInUser] = await Promise.all([
    getUserLikes(username),
    getCurrentLoggedInUser(),
  ]);

  const fetchNextUserTweetsPage = async (cursor: string) => {
    "use server";
    const tweets = await getUserLikes(username, cursor);
    return tweets;
  };

  return (
    <>
      {/** Tweets */}
      <div>
        <InfiniteTweets
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
          fetchNextPage={fetchNextUserTweetsPage}
          isUserProfile
        />
      </div>
    </>
  );
}
