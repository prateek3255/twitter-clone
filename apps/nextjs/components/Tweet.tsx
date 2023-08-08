import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { startTransition } from "react";
import { formatDistanceToNowStrict } from "date-fns";
import { Retweet } from "ui/icons";
import { formatDistanceForTweet } from "utils/common";
import { toggleTweetLike, toggleTweetRetweet } from "app/actions";
import { TweetAction } from "components/TweetAction";
import { DEFAULT_PROFILE_IMAGE } from "constants/user";

export interface TweetProps {
  username: string;
  name: string;
  profileImage?: string | null;
  content: string;
  createdAt: Date;
  likes: number;
  replies: number;
  retweets: number;
  id: string;
  onLikeClick?: (tweetId: string) => void;
  hasLiked?: boolean;
  onRetweetClick?: (tweetId: string) => void;
  hasRetweeted?: boolean;
}

export const Tweet = ({
  username,
  name,
  profileImage,
  content,
  createdAt,
  likes,
  replies,
  retweets,
  id,
  onLikeClick,
  hasLiked,
  onRetweetClick,
  hasRetweeted,
}: TweetProps) => {
  const router = useRouter();

  const handleTweetClick = () => {
    const isTextSelected = window.getSelection()?.toString();
    if (isTextSelected) return;
    router.push(`/status/${id}`);
  };

  return (
    <article
      onClick={handleTweetClick}
      className="p-4 border-b border-solid border-gray-700 cursor-pointer"
    >
      {hasRetweeted && (
        <div className="flex items-center gap-3 text-gray-500 text-xs ml-6 mb-1 font-bold mt-[-4px]">
          <Retweet className="w-4 h-4" />
          <span>You Retweeted</span>
        </div>
      )}
      <div className="flex gap-3 w-full">
        <Image
          src={profileImage ?? DEFAULT_PROFILE_IMAGE}
          width={48}
          height={48}
          className="rounded-full max-h-[48px]"
          alt={`${username}'s profile image`}
        />
        <div className="flex flex-col w-full">
          <div className="flex items-center gap-1">
            <Link
              href={`/${username}`}
              onClick={(event) => {
                event.stopPropagation();
              }}
              className="text-white font-bold text-sm hover:underline"
            >
              {name}
            </Link>
            <span className="text-gray-500 text-sm">@{username}</span>
            <span className="text-gray-500 text-sm">·</span>
            <span className="text-gray-500 text-sm">
              {formatDistanceForTweet(formatDistanceToNowStrict(createdAt))}
            </span>
          </div>
          <div className="flex flex-col gap-3">
            <span className="text-white text-sm">{content}</span>
            <div className="flex max-w-[310px] w-full justify-between">
              <TweetAction
                size="compact"
                type="reply"
                count={replies}
                action={() => {}}
              />
              <TweetAction
                size="compact"
                type="retweet"
                active={hasRetweeted}
                count={retweets}
                action={() => {
                  startTransition(() => {
                    toggleTweetRetweet({
                      tweetId: id,
                      hasRetweeted: !hasRetweeted,
                    });
                  });
                  onRetweetClick?.(id);
                }}
              />
              <TweetAction
                size="compact"
                active={hasLiked}
                type="like"
                count={likes}
                action={() => {
                  startTransition(() => {
                    toggleTweetLike({ tweetId: id, hasLiked: !hasLiked });
                  });
                  onLikeClick?.(id);
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};
