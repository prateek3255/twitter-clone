import { BackButton } from "ui/icons";
import Image from "next/image";
import Link from "next/link";
import { Retweet } from "ui/icons";
import { format } from "date-fns";
import { DEFAULT_PROFILE_IMAGE } from "constants/user";
import { TweetActions } from "./components/TweetActions";
import { getTweetReplies, getTweetWithID, TweetWithMeta } from "utils/tweet";
import { notFound } from "next/navigation";
import { getCurrentLoggedInUser } from "utils/user";
import { InfiniteTweets } from "components/InfiniteTweets";

const TweetStat = ({ label, count }: { label: string; count: number }) => (
  <div className="flex gap-1">
    <span className="text-white font-bold text-sm">{count}</span>
    <span className="text-gray-500 text-sm">{label}</span>
  </div>
);

const getTweetInfo = (tweet: TweetWithMeta, isLoggedIn: boolean) => {
  if (tweet.retweetOf) {
    return {
      id: tweet.id,
      content: tweet.retweetOf.content,
      createdAt: tweet.retweetOf.createdAt,
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
    createdAt: tweet.createdAt,
    name: tweet.author.name ?? "",
    profileImage: tweet.author.profileImage,
    username: tweet.author.username,
    likes: tweet._count.likes,
    replies: tweet._count.replies,
    retweets: tweet._count.retweets,
    hasLiked: tweet.likes.length > 0  && isLoggedIn,
    hasRetweeted: tweet.retweets.length > 0 && isLoggedIn,
    originalTweetId: null,
  };
};

export default async function TweetStatus({
  params: { id },
}: {
  params: { id: string };
}) {
  const [tweet, user] = await Promise.all([
    getTweetWithID(id),
    getCurrentLoggedInUser(),
  ]);

  if (!tweet) {
    notFound();
  }

  const originalTweetId = tweet?.retweetOf?.id ?? tweet?.id;

  const initialReplies = await getTweetReplies(originalTweetId);

  const isLoggedIn = !!user;

  const tweetInfo = getTweetInfo(tweet, isLoggedIn);
  const currentLoggedInUser = user
    ? {
        id: user?.id,
        name: user?.name ?? undefined,
        username: user?.username,
        profileImage: user?.profileImage,
      }
    : undefined;

  const fetchNextRepliesPage = async (cursor: string) => {
    "use server";
    const replies = await getTweetReplies(originalTweetId, cursor);
    return replies;
  };

  return (
    <>
      {/* Header */}
      <div className="h-14 w-full px-4 flex items-center">
        <div className="min-w-[56px] flex items-center">
          <button className="text-white p-2 rounded-full hover:bg-gray-100/10">
            <BackButton aria-label="Go back" />
          </button>
        </div>
        <span className="text-white text-xl font-bold">Tweet</span>
      </div>
      {/* Tweet large */}
      <article className="px-4">
        {tweetInfo.originalTweetId && (
          <div className="flex items-center gap-3 text-gray-500 text-xs ml-6 mb-1 font-bold mt-[-4px]">
            <Retweet className="w-4 h-4" />
            <span>
              {tweetInfo.retweetAuthor?.name ??
                tweetInfo.retweetAuthor?.username}{" "}
              Retweeted
            </span>
          </div>
        )}
        <div className="flex gap-3 w-full items-center pt-3 pb-2">
          <Image
            src={tweetInfo.profileImage ?? DEFAULT_PROFILE_IMAGE}
            width={48}
            height={48}
            className="rounded-full max-h-[48px]"
            alt={`${tweetInfo.username}'s profile image`}
          />
          <div className="flex flex-col w-full">
            <Link
              href={`/${tweetInfo.username}`}
              className="text-white font-bold text-sm hover:underline"
            >
              {tweetInfo.name}
            </Link>
            <span className="text-gray-500 text-sm">@{tweetInfo.username}</span>
          </div>
        </div>
        <div className="flex flex-col mt-2">
          <p className="text-white text-base">{tweetInfo.content}</p>
          <div className="py-4 text-gray-500 text-sm border-b border-solid border-gray-700">
            <time dateTime={`${tweetInfo.createdAt.toISOString()}`}>
              {format(tweetInfo.createdAt, "h:mm a · MMM d, yyyy")}
            </time>
          </div>
        </div>
        <div className="py-4 flex gap-5 border-b border-solid border-gray-700">
          <TweetStat label="Likes" count={tweetInfo.likes} />
          <TweetStat label="Retweets" count={tweetInfo.retweets} />
        </div>
        <TweetActions
          hasLiked={tweetInfo.hasLiked}
          hasRetweeted={tweetInfo.hasRetweeted}
          tweetInfo={{
            id: originalTweetId,
            content: tweetInfo.content,
            createdAt: tweetInfo.createdAt,
            name: tweetInfo.name,
            profileImage: tweetInfo.profileImage,
            username: tweetInfo.username,
          }}
          currentLoggedInUser={currentLoggedInUser}
        />
      </article>
      {/* Replies */}
      <div>
        <InfiniteTweets
          initialTweets={initialReplies}
          currentLoggedInUser={currentLoggedInUser}
          fetchNextPage={fetchNextRepliesPage}
        />
      </div>
    </>
  );
}

export const dynamic = "force-dynamic";
