import { defer, type LoaderArgs, type V2_MetaFunction } from "@remix-run/node";
import { getUserReplies } from "~/utils/tweets.server";
import { getCurrentLoggedInUser } from "~/utils/user.server";
import { SuspendedInfiniteTweets } from "./resource.infinite-tweets";
import { useLoaderData } from "@remix-run/react";

export const loader = async ({ request, params }: LoaderArgs) => {
  const username = params.username as string;

  return defer({
    tweets: getUserReplies(request, username).then((tweets) =>
      tweets.map((tweet) => ({
        ...tweet,
        createdAt: tweet.createdAt.toISOString(),
      }))
    ),
    currentLoggedInUser: await getCurrentLoggedInUser(request),
    username,
  });
};

export const meta: V2_MetaFunction<typeof loader> = ({
  matches
}) => {
  const parentMeta = matches.flatMap(
    // @ts-expect-error
    (match) => match.meta ?? []
  )[0];
  return [
    { title: `Tweeets with replies by ${parentMeta?.title ?? ""} | Twitter Clone`, },
  ];
};

export default function UserReplies() {
  const data = useLoaderData<typeof loader>();

  return (
    <SuspendedInfiniteTweets
      key={data.username}
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
      type="user_replies"
      username={data.username}
      isUserProfile
    />
  );
}
