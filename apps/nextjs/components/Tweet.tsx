import React from "react";
import Image from "next/image";
import { startTransition } from "react";
import { formatDistanceToNowStrict } from "date-fns";
import { Reply, Retweet, RetweetFilled, Like, LikeFilled } from "ui/icons";
import { formatDistanceForTweet } from "utils/common";
import { toggleTweetLike, toggleTweetRetweet } from "app/actions";

type ActionType = "reply" | "retweet" | "like";

const TweetActionDetails = {
  reply: {
    icon: <Reply />,
    activeIcon: <Reply />,
    activeColor: "text-primary-blue",
    hoverBg: "hover:text-primary-blue [&_>_div_>_div]:hover:bg-primary-blue/10",
  },
  retweet: {
    icon: <Retweet />,
    activeIcon: <RetweetFilled />,
    activeColor: "text-primary-green",
    hoverBg:
      "hover:text-primary-green [&_>_div_>_div]:hover:bg-primary-green/10",
  },
  like: {
    icon: <Like />,
    activeIcon: <LikeFilled />,
    activeColor: "text-primary-red",
    hoverBg: "hover:text-primary-red [&_>_div_>_div]:hover:bg-primary-red/10",
  },
};

const ActiveLabel: Record<ActionType, string> = {
  reply: "Replied",
  retweet: "Retweeted",
  like: "Liked",
};

const TweetAction = ({
  type,
  count,
  action,
  active = false,
}: {
  type: ActionType;
  count: number;
  action: () => void;
  active?: boolean;
}) => {
  const { icon, hoverBg, activeColor, activeIcon } = TweetActionDetails[type];
  return (
    <button
      aria-label={type}
      className={`flex items-center gap-3 ${
        active ? activeColor : "text-gray-500"
      } transition-colors ${hoverBg}`}
      onClick={action}
    >
      <div className="relative">
        <div className="absolute top-0 left-0 right-0 bottom-0 rounded-full m-[-8px] transition-colors"></div>
        {active ? activeIcon : icon}
      </div>
      <span className="text-xs">{count}</span>
      <span className="sr-only">{`${count} ${type}s. ${
        active ? ActiveLabel[type] : ""
      }`}</span>
    </button>
  );
};

export interface TweetProps {
  username: string;
  name: string;
  profileImage: string;
  content: string;
  createdAt: Date;
  likes: number;
  replies: number;
  retweets: number;
  id: number;
  onLikeClick?: (tweetId: number) => void;
  hasLiked?: boolean;
  onRetweetClick?: (tweetId: number) => void;
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
  return (
    <article className="p-4 border-b border-solid border-gray-700">
      <div className="flex gap-3 w-full">
        <Image
          src={profileImage}
          width={48}
          height={48}
          className="rounded-full max-h-[48px]"
          alt={`${username}'s profile image`}
        />
        <div className="flex flex-col w-full">
          <div className="flex items-center gap-1">
            <span className="text-white font-bold text-sm">{name}</span>
            <span className="text-gray-500 text-sm">@{username}</span>
            <span className="text-gray-500 text-sm">·</span>
            <span className="text-gray-500 text-sm">
              {formatDistanceForTweet(formatDistanceToNowStrict(createdAt))}
            </span>
          </div>
          <div className="flex flex-col gap-3">
            <span className="text-white text-sm">{content}</span>
            <div className="flex max-w-[310px] w-full justify-between">
              <TweetAction type="reply" count={replies} action={() => {}} />
              <TweetAction
                type="retweet"
                active={hasRetweeted}
                count={retweets}
                action={() => {
                  startTransition(() => {
                    toggleTweetRetweet(id, !hasRetweeted);
                  });
                  onRetweetClick?.(id);
                }}
              />
              <TweetAction
                active={hasLiked}
                type="like"
                count={likes}
                action={() => {
                  startTransition(() => {
                    toggleTweetLike(id, !hasLiked);
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
