import { BackButton } from "ui/icons";
import Image from "next/image";
import { Retweet } from "ui/icons";
import { format } from "date-fns";
import { DEFAULT_PROFILE_IMAGE } from "constants/user";
import { TweetActions } from "./components/TweetActions";
import { getTweetWithID, TweetWithMeta } from "utils/tweet";
import { notFound } from "next/navigation";

const TweetStat = ({ label, count }: { label: string; count: number }) => (
  <div className="flex gap-1">
    <span className="text-white font-bold text-sm">{count}</span>
    <span className="text-gray-500 text-sm">{label}</span>
  </div>
);

const getTweetInfo = (tweet: TweetWithMeta) => {
  if (tweet.retweetOf) {
    return {
      id: tweet.retweetOf.id,
      content: tweet.retweetOf.content,
      createdAt: tweet.retweetOf.createdAt,
      name: tweet.retweetOf.author.name ?? "",
      profileImage: tweet.retweetOf.author.profileImage,
      username: tweet.retweetOf.author.username,
      likes: tweet.retweetOf._count.likes,
      replies: tweet.retweetOf._count.replies,
      retweets: tweet.retweetOf._count.retweets,
      hasLiked: tweet.retweetOf.likes.length > 0,
      hasRetweeted: tweet.retweetOf.retweets.length > 0,
      isRetweet: true,
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
    hasLiked: tweet.likes.length > 0,
    hasRetweeted: tweet.retweets.length > 0,
    isRetweet: false,
  };
};

export default async function TweetStatus({
  params: { id },
}: {
  params: { id: string };
}) {
  const tweetId = parseInt(id);

  const tweet = await getTweetWithID(tweetId);

  if (!tweet) {
    notFound();
  }

  const tweetInfo = getTweetInfo(tweet);

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
        {tweetInfo.isRetweet && (
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
            alt={`{username}'s profile image`}
          />
          <div className="flex flex-col w-full">
            <span className="text-white font-bold text-sm">
              {tweetInfo.name}
            </span>
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
          tweetId={tweetInfo.id}
        />
      </article>
    </>
  );
}

export const dynamic = 'force-dynamic'
