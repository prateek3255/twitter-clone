import React from "react";
import Image from "next/image";
import { formatDistanceToNowStrict } from "date-fns";
import { Reply, Retweet, Like } from "ui/icons";
import { formatDistanceForTweet } from "utils/common";

type ActionType = "reply" | "retweet" | "like";

const TweetActionDetails = {
  reply: {
    icon: <Reply />,
    activeColor: "text-primary-blue",
    hoverBg: "hover:text-primary-blue [&_>_div_>_div]:hover:bg-primary-blue/10",
  },
  retweet: {
    icon: <Retweet />,
    activeColor: "text-primary-green",
    hoverBg:
      "hover:text-primary-green [&_>_div_>_div]:hover:bg-primary-green/10",
  },
  like: {
    icon: <Like />,
    activeColor: "text-primary-red",
    hoverBg: "hover:text-primary-red [&_>_div_>_div]:hover:bg-primary-red/10",
  },
};

const TweetAction = ({ type, count }: { type: ActionType; count: number }) => {
  const { icon, hoverBg } = TweetActionDetails[type];
  return (
    <button
      aria-label={type}
      className={`flex items-center gap-3 text-gray-500 transition-colors ${hoverBg}`}
    >
      <div className="relative">
        <div className="absolute top-0 left-0 right-0 bottom-0 rounded-full m-[-8px] transition-colors"></div>
        {icon}
      </div>
      <span className="text-xs">{count}</span>
    </button>
  );
};

export interface TweetProps {
  username: string;
  name: string;
  profileImage: string;
  content: string;
  timestamp: Date;
  likes: number;
  replies: number;
  retweets: number;
}

export const Tweet = ({
  username,
  name,
  profileImage,
  content,
  timestamp,
  likes,
  replies,
  retweets,
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
              {formatDistanceForTweet(formatDistanceToNowStrict(timestamp))}
            </span>
          </div>
          <div className="flex flex-col gap-3">
            <span className="text-white text-sm">{content}</span>
            <div className="flex max-w-[310px] w-full justify-between">
              <TweetAction type="reply" count={replies} />
              <TweetAction type="retweet" count={retweets} />
              <TweetAction type="like" count={likes} />
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};
