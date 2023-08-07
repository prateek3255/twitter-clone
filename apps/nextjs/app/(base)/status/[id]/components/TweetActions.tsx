"use client";

import { toggleTweetLike, toggleTweetRetweet } from "app/actions";
import { TweetAction } from "components/TweetAction";
import {
  useTransition,
  experimental_useOptimistic as useOptimistic,
} from "react";

const TweetActions = ({
  hasLiked,
  hasRetweeted,
  tweetId,
}: {
  hasLiked: boolean;
  hasRetweeted: boolean;
  tweetId: string;
}) => {
  // TODO: Figure out why this does not work
  const [optimisticHasLiked, toggleOptimisticHasLiked] = useOptimistic(
    hasLiked,
    (prevHasLiked) => {
      console.log({ prevHasLiked });
      return !prevHasLiked;
    }
  );

  const [_, startTransition] = useTransition();
  return (
    <div className="py-4 flex justify-around gap-5 border-b border-solid border-gray-700">
      <TweetAction size="normal" type="reply" action={() => {}} />
      <TweetAction
        size="normal"
        type="retweet"
        active={hasRetweeted}
        action={() => {
          startTransition(async () => {
            await toggleTweetRetweet({
              tweetId,
              hasRetweeted: !hasRetweeted,
            });
          });
        }}
      />
      <TweetAction
        size="normal"
        type="like"
        active={optimisticHasLiked}
        action={() => {
          toggleOptimisticHasLiked(!optimisticHasLiked);
          startTransition(async () => {
            await toggleTweetLike({ tweetId, hasLiked: !optimisticHasLiked });
          });
        }}
      />
      {/* <div className="h-6 w-6" /> */}
    </div>
  );
};

export { TweetActions };
