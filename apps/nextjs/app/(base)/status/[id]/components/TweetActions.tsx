"use client";
import { toggleTweetLike, toggleTweetRetweet } from "app/actions";
import { ReplyModal } from "components/ReplyModal";
import { TweetAction } from "components/TweetAction";
import {
  useTransition,
  useState,
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

  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);

  const [isPending, startTransition] = useTransition();
  return (
    <>
      <div className="py-4 flex justify-around gap-5 border-b border-solid border-gray-700">
        <TweetAction
          size="normal"
          type="reply"
          disabled={isPending}
          action={() => setIsReplyModalOpen(true)}
        />
        <TweetAction
          size="normal"
          type="retweet"
          active={hasRetweeted}
          disabled={isPending}
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
          active={hasLiked}
          disabled={isPending}
          action={() => {
            startTransition(async () => {
              await toggleTweetLike({
                tweetId: tweetInfo.id,
                hasLiked: !hasLiked,
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
