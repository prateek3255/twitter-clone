"use client";
import { toggleTweetLike, toggleTweetRetweet } from "app/actions";
import { ReplyModal } from "components/ReplyModal";
import { TweetAction } from "components/TweetAction";
import {
  useTransition,
  useState,
  experimental_useOptimistic as useOptimistic,
} from "react";
import { LoggedInUserBaseInfo, TweetBaseInfo } from "types/common";

const TweetActions = ({
  hasLiked,
  hasRetweeted,
  tweetInfo,
  currentLoggedInUser,
}: {
  hasLiked: boolean;
  hasRetweeted: boolean;
  tweetInfo: TweetBaseInfo;
  currentLoggedInUser?: LoggedInUserBaseInfo;
}) => {
  // TODO: Figure out why this does not work
  const [optimisticHasLiked, toggleOptimisticHasLiked] = useOptimistic(
    hasLiked,
    (prevHasLiked) => {
      return !prevHasLiked;
    }
  );

  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);

  const [_, startTransition] = useTransition();
  return (
    <>
      <div className="py-4 flex justify-around gap-5 border-b border-solid border-gray-700">
        <TweetAction
          size="normal"
          type="reply"
          action={() => setIsReplyModalOpen(true)}
        />
        <TweetAction
          size="normal"
          type="retweet"
          active={hasRetweeted}
          action={() => {
            startTransition(async () => {
              await toggleTweetRetweet({
                tweetId: tweetInfo.id,
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
              await toggleTweetLike({
                tweetId: tweetInfo.id,
                hasLiked: !optimisticHasLiked,
              });
            });
          }}
        />
      </div>
      <ReplyModal
        isOpen={isReplyModalOpen}
        closeModal={() => {
          setIsReplyModalOpen(false);
        }}
        originalTweet={tweetInfo}
        currentLoggedInUser={currentLoggedInUser}
      />
    </>
  );
};

export { TweetActions };
