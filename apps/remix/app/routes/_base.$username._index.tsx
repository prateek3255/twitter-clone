import { defer, type LoaderArgs } from "@remix-run/node";
import { getTweetsByUsername } from "~/utils/tweets.server";
import { getCurrentLoggedInUser } from "~/utils/user.server";
import { SuspendedInfiniteTweets } from "./resource.infinite-tweets";
import { useLoaderData } from "@remix-run/react";

export const loader = async ({ request, params }: LoaderArgs) => {
  const username = params.username as string;

  return defer({
    tweets: getTweetsByUsername(request, username).then((tweets) =>
      tweets.map((tweet) => ({
        ...tweet,
        createdAt: tweet.createdAt.toISOString(),
      }))
    ),
    currentLoggedInUser: await getCurrentLoggedInUser(request),
    username,
  });
};

export default function UserTweets() {
  const data = useLoaderData<typeof loader>();

  return (
    <SuspendedInfiniteTweets
      initialTweetsPromise={data.tweets}
      currentLoggedInUser={
        data.currentLoggedInUser
          ? {
              id: data.currentLoggedInUser.id,
              username: data.currentLoggedInUser.username,
              name: data.currentLoggedInUser.name ?? undefined,
              profileImage: data.currentLoggedInUser.profileImage,
            }
          : undefined
      }
      type="user_tweets"
      username={data.username}
      isUserProfile
    />
  );
}
