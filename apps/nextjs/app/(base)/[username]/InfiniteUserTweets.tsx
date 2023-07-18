"use client";
import React from "react";
import { Tweet } from "components/Tweet";
import type { TweetWithMeta as TweetType } from "utils/tweet";
import { useIntersectionObserver } from "hooks/useIntesectionObserver";
import { fetchNextUserTweetsPage } from "app/actions";
import { Spinner } from "components/Spinner";

export const InfiniteUserTweets = ({
  initialTweets,
  username,
  profileImage,
  name,
}: {
  initialTweets: Array<TweetType>;
  username: string;
  profileImage: string;
  name?: string | null;
}) => {
  const [tweets, setTweets] = React.useState(initialTweets);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isLastPage, setIsLastPage] = React.useState(false);
  const endOfTweetsRef = React.useRef<HTMLDivElement>(null);
  const entry = useIntersectionObserver(endOfTweetsRef, {});
  const isVisible = !!entry?.isIntersecting;
  const lastTweetId = tweets[tweets.length - 1]?.id;

  const [prevInitialTweets, setPrevInitialTweets] = React.useState(initialTweets);
  if (prevInitialTweets !== initialTweets && initialTweets.length > 0) {
    const newTweet = initialTweets[0];
    setPrevInitialTweets(initialTweets);
    setTweets((tweets) => [newTweet, ...tweets]);
  }

  React.useEffect(() => {
    const updateTweets = async () => {
      if (isLoading || isLastPage) {
        return;
      }
      setIsLoading(true);
      const nextTweets = await fetchNextUserTweetsPage(username, lastTweetId);
      setIsLoading(false);
      setTweets((tweets) => [...tweets, ...nextTweets]);
      if (nextTweets.length === 0) {
        setIsLastPage(true);
      }
    };
    if (isVisible) {
      updateTweets();
    }
  }, [isVisible, username, lastTweetId, isLoading, isLastPage]);

  return (
    <>
      {tweets.map((tweet) => (
        <Tweet
          key={tweet.id}
          username={username}
          name={name ?? ""}
          content={tweet.content}
          profileImage={profileImage}
          timestamp={tweet.createdAt}
          likes={tweet._count.likes}
          replies={tweet._count.replies}
          retweets={tweet._count.retweets}
        />
      ))}
      <div className="h-1" ref={endOfTweetsRef} />
      {isLoading && <Spinner />}
    </>
  );
};
