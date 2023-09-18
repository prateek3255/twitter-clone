import { Retweet } from "ui";
import { useState, useCallback } from "react";
import { useLoaderData, Link, useNavigation, Form } from "@remix-run/react";
import { format, parseISO } from "date-fns";
import { json, type LoaderArgs, defer } from "@remix-run/node";
import { DEFAULT_PROFILE_IMAGE } from "~/constants/user";
import {
  getTweetReplies,
  getTweetWithID,
  type TweetWithMeta,
} from "~/utils/tweets.server";
import { getCurrentLoggedInUser } from "~/utils/user.server";
import { BackButton } from "~/components/BackButton";
import { TweetAction } from "~/components/TweetAction";
import { ReplyModal } from "~/components/ReplyModal";
import { SuspendedInfiniteTweets } from "./resource.infinite-tweets";

const TweetStat = ({ label, count }: { label: string; count: number }) => (
  <div className="flex gap-1">
    <span className="text-white font-bold text-sm">{count}</span>
    <span className="text-gray-500 text-sm">{label}</span>
  </div>
);

export const loader = async ({ request, params }: LoaderArgs) => {
  const [tweet, user] = await Promise.all([
    getTweetWithID(request, params.id as string),
    getCurrentLoggedInUser(request),
  ]);

  if (!tweet) {
    throw json(
      { error: "User not found", username: params.username },
      { status: 404 }
    );
  }
  const tweetInfo = getTweetInfo(tweet, !!user);
  return defer({
    tweet: tweetInfo,
    user,
    replies: getTweetReplies(request, tweetInfo.originalTweetId ?? tweetInfo.id).then((tweets) =>
      tweets.map((tweet) => ({
        ...tweet,
        createdAt: tweet.createdAt.toISOString(),
      }))
    ),
  });
};

const getTweetInfo = (tweet: TweetWithMeta, isLoggedIn: boolean) => {
  if (tweet.retweetOf) {
    return {
      id: tweet.id,
      content: tweet.retweetOf.content,
      createdAt: tweet.retweetOf.createdAt.toISOString(),
      name: tweet.retweetOf.author.name ?? "",
      profileImage: tweet.retweetOf.author.profileImage,
      username: tweet.retweetOf.author.username,
      likes: tweet.retweetOf._count.likes,
      replies: tweet.retweetOf._count.replies,
      retweets: tweet.retweetOf._count.retweets,
      hasLiked: tweet.retweetOf.likes.length > 0 && isLoggedIn,
      hasRetweeted: tweet.retweetOf.retweets.length > 0 && isLoggedIn,
      originalTweetId: tweet.retweetOf.id,
      retweetAuthor: tweet.author,
    };
  }

  return {
    id: tweet.id,
    content: tweet.content,
    createdAt: tweet.createdAt.toISOString(),
    name: tweet.author.name ?? "",
    profileImage: tweet.author.profileImage,
    username: tweet.author.username,
    likes: tweet._count.likes,
    replies: tweet._count.replies,
    retweets: tweet._count.retweets,
    hasLiked: tweet.likes.length > 0 && isLoggedIn,
    hasRetweeted: tweet.retweets.length > 0 && isLoggedIn,
    originalTweetId: null,
  };
};

export default function TweetStatus() {
  const { tweet, user, replies } = useLoaderData<typeof loader>();
  const originalTweetId = tweet?.originalTweetId ?? tweet?.id;
  const navigation = useNavigation();
  const isLoading = navigation.state === "loading";
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
  const closeReplyModal = useCallback(() => {
    setIsReplyModalOpen(false);
  }, []);

  const currentLoggedInUser = user
    ? {
        id: user?.id,
        name: user?.name ?? undefined,
        username: user?.username,
        profileImage: user?.profileImage,
      }
    : undefined;

  return (
    <>
      {/* Header */}
      <div className="h-14 w-full px-4 flex items-center gap-5">
        <BackButton />
        <span className="text-white text-xl font-bold">Tweet</span>
      </div>
      {/* Tweet large */}
      <article className="px-4">
        {tweet.originalTweetId && (
          <div className="flex items-center gap-3 text-gray-500 text-xs ml-6 mb-1 font-bold mt-[-4px]">
            <Retweet className="w-4 h-4" />
            <span>
              {tweet.retweetAuthor?.name ?? tweet.retweetAuthor?.username}{" "}
              Retweeted
            </span>
          </div>
        )}
        <div className="flex gap-3 w-full items-center pt-3 pb-2">
          <img
            src={tweet.profileImage ?? DEFAULT_PROFILE_IMAGE}
            width={48}
            height={48}
            className="rounded-full max-h-[48px]"
            alt={`${tweet.username}'s avatar`}
          />
          <div className="flex flex-col w-full">
            <Link
              to={`/${tweet.username}`}
              className="text-white font-bold text-sm hover:underline"
            >
              {tweet.name}
            </Link>
            <span className="text-gray-500 text-sm">@{tweet.username}</span>
          </div>
        </div>
        <div className="flex flex-col mt-2">
          <p className="text-white text-base">{tweet.content}</p>
          <div className="py-4 text-gray-500 text-sm border-b border-solid border-gray-700">
            <time dateTime={tweet.createdAt}>
              {format(parseISO(tweet.createdAt), "h:mm a · MMM d, yyyy")}
            </time>
          </div>
        </div>
        <div className="py-4 flex gap-5 border-b border-solid border-gray-700">
          <TweetStat label="Likes" count={tweet.likes} />
          <TweetStat label="Retweets" count={tweet.retweets} />
        </div>
        <div className="py-4 flex justify-around gap-5 border-b border-solid border-gray-700">
          <TweetAction
            size="normal"
            type="reply"
            disabled={isLoading}
            action={() => setIsReplyModalOpen(true)}
          />
          <Form method="post" action="/resource/infinite-tweets">
            <input type="hidden" name="tweetId" value={originalTweetId} />
            <input
              type="hidden"
              name="hasRetweeted"
              value={(!tweet.hasRetweeted).toString()}
            />
            <TweetAction
              size="normal"
              type="retweet"
              active={tweet.hasRetweeted}
              disabled={isLoading}
              submit
              name="_action"
              value="toggle_tweet_retweet"
            />
          </Form>
          <Form method="post" action="/resource/infinite-tweets">
            <input type="hidden" name="tweetId" value={originalTweetId} />
            <input
              type="hidden"
              name="hasLiked"
              value={(!tweet.hasLiked).toString()}
            />
            <TweetAction
              size="normal"
              type="like"
              active={tweet.hasLiked}
              disabled={isLoading}
              submit
              name="_action"
              value="toggle_tweet_like"
            />
          </Form>
        </div>
        <ReplyModal
          isOpen={isReplyModalOpen}
          closeModal={closeReplyModal}
          originalTweet={{
            id: originalTweetId,
            content: tweet.content,
            createdAt: tweet.createdAt,
            name: tweet.name,
            profileImage: tweet.profileImage,
            username: tweet.username,
          }}
          currentLoggedInUser={currentLoggedInUser}
        />
      </article>
      {/* Replies */}
      <div>
        <SuspendedInfiniteTweets
          key={originalTweetId}
          initialTweetsPromise={replies}
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
          type="tweet_replies"
          tweetId={originalTweetId}
        />
      </div>
    </>
  );
}
