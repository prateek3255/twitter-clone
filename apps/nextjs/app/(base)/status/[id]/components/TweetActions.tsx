"use client";

import { TweetAction } from "components/TweetAction";

const TweetActions = ({
  hasLiked,
  hasRetweeted,
  tweetId,
}: {
  hasLiked: boolean;
  hasRetweeted: boolean;
  tweetId: number;
}) => {
  return (
    <div className="py-4 flex justify-around gap-5 border-b border-solid border-gray-700">
      <TweetAction size="normal" type="reply" action={() => {}} />
      <TweetAction size="normal" type="retweet" action={() => {}} />
      <TweetAction size="normal" type="like" action={() => {}} />
      {/* <div className="h-6 w-6" /> */}
    </div>
  );
};

export { TweetActions };
