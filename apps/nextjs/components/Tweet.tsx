import React from "react";
import Image from "next/image";
import { Reply, Retweet, Like } from "ui/icons";

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
    hoverBg: "hover:text-primary-green [&_>_div_>_div]:hover:bg-primary-green/10",
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

const Tweet = () => {
  return (
    <article className="p-4 border-b border-solid border-gray-700">
      <div className="flex gap-3">
        <Image
          src="https://pbs.twimg.com/profile_images/1608754757967183872/GJO7c_03_400x400.jpg"
          width={48}
          height={48}
          className="rounded-full max-h-[48px]"
          alt="Prateek Surana"
        />
        <div className="flex flex-col">
          <div className="flex items-center gap-1">
            <span className="text-white font-bold text-sm">Prateek Surana</span>
            <span className="text-gray-500 text-sm">@psuranas</span>
            <span className="text-gray-500 text-sm">·</span>
            <span className="text-gray-500 text-sm">1h</span>
          </div>
          <div className="flex flex-col gap-3">
            <span className="text-white text-sm">
              The next version of Google&apos;s phone will not take good
              pictures since it will Pixel 8
            </span>
            <div className="flex max-w-[310px] justify-between">
              <TweetAction type="reply" count={6} />
              <TweetAction type="retweet" count={2} />
              <TweetAction type="like" count={18} />
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default Tweet;
