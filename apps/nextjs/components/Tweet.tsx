"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { formatDistanceToNowStrict } from "date-fns";
import { Retweet } from "ui/icons";
import { formatDistanceForTweet } from "utils/common";
import { toggleTweetLike, toggleTweetRetweet } from "app/actions";
import { TweetAction } from "components/TweetAction";
import { DEFAULT_PROFILE_IMAGE } from "constants/user";
import { ReplyModal } from "./ReplyModal";
import { LoggedInUserBaseInfo } from "types/common";

interface BaseTweetProps {
  username: string;
  name: string;
  profileImage?: string | null;
  content: string;
  createdAt: Date;
  likes: number;
  replies: number;
  retweets: number;
  id: string;
  onReplySuccess?: (tweetId: string) => void;
  onLikeClick?: (tweetId: string) => void;
  hasLiked?: boolean;
  onRetweetClick?: (tweetId: string) => void;
  hasRetweeted?: boolean;
  currentLoggedInUser?: LoggedInUserBaseInfo;
  originalTweetId: string | null;
  showOwnRetweet?: boolean;
}

interface RetweetProps extends BaseTweetProps {
  originalTweetId: string;
  retweetAuthor: {
    username: string;
    name?: string | null;
  };
}

interface DefaultTweetProps extends BaseTweetProps {
  originalTweetId: null;
}

type TweetProps = RetweetProps | DefaultTweetProps;

export const Tweet = (props: TweetProps) => {
  const router = useRouter();
  const {
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
    currentLoggedInUser,
    onReplySuccess,
    showOwnRetweet
  } = props;
  const [isReplyModalOpen, setIsReplyModalOpen] = React.useState(false);
  const [isPending, startTransition] = useTransition();
  const isRetweet = typeof props.originalTweetId === "string";
  const originalTweetId = props.originalTweetId ?? id;

  const handleTweetClick = () => {
    const isTextSelected = window.getSelection()?.toString();
    if (isTextSelected) return;
    router.push(`/status/${id}`);
  };

  const showRetweetedBy = showOwnRetweet ? hasRetweeted || isRetweet : isRetweet;

  return (
    <>
      <article
        onClick={handleTweetClick}
        className="p-4 border-b border-solid border-gray-700 cursor-pointer"
      >
        {showRetweetedBy && (
          <div className="flex items-center gap-3 text-gray-500 text-xs ml-6 mb-1 font-bold mt-[-4px]">
            <Retweet className="w-4 h-4" />
            <span>
              {isRetweet && !hasRetweeted
                ? `${
                    props.retweetAuthor?.name ?? props.retweetAuthor.username
                  } Retweeted`
                : "You Retweeted"}
            </span>
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
                  disabled={isPending}
                  action={() => setIsReplyModalOpen(true)}
                />
                <TweetAction
                  size="compact"
                  type="retweet"
                  active={hasRetweeted}
                  count={retweets}
                  disabled={isPending}
                  action={() => {
                    startTransition(() => {
                      toggleTweetRetweet({
                        tweetId: originalTweetId,
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
                  disabled={isPending}
                  action={() => {
                    startTransition(() => {
                      toggleTweetLike({ tweetId: originalTweetId, hasLiked: !hasLiked });
                    });
                    onLikeClick?.(id);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </article>
      <ReplyModal
        isOpen={isReplyModalOpen}
        closeModal={() => setIsReplyModalOpen(false)}
        originalTweet={{
          id: originalTweetId,
          username,
          name,
          profileImage,
          content,
          createdAt,
        }}
        currentLoggedInUser={currentLoggedInUser}
        onReply={() => onReplySuccess?.(id)}
      />
    </>
  );
};
