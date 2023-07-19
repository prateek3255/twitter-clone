"use client";
import React from "react";
import { Tweet } from "components/Tweet";
import type { TweetWithMeta as TweetType } from "utils/tweet";
import { useIntersectionObserver } from "hooks/useIntesectionObserver";
import { fetchNextUserTweetsPage } from "app/actions";
import { Spinner } from "components/Spinner";

type State = {
  tweets: Array<TweetType>;
  isLastPage: boolean;
}

type Action = {
  type: "add_tweets";
  newTweets: Array<TweetType>;
} | {
  type: "update_latest_tweet";
  newInitialTweets: Array<TweetType>;
}

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "add_tweets":
      return {
        ...state,
        tweets: [...state.tweets, ...action.newTweets],
        isLastPage: action.newTweets.length === 0,
      };
    case "update_latest_tweet":
      const newTweet = action.newInitialTweets[0];
      return {
        ...state,
        tweets: [newTweet, ...state.tweets],
      };
    default:
      return state;
  }
}

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
  const [{ tweets, isLastPage }, dispatch] = React.useReducer(reducer, {
    tweets: initialTweets,
    isLastPage: false,
  });
  const [isLoading, setIsLoading] = React.useState(false);
  const endOfTweetsRef = React.useRef<HTMLDivElement>(null);
  const entry = useIntersectionObserver(endOfTweetsRef, {});
  const isVisible = !!entry?.isIntersecting;
  const lastTweetId = tweets[tweets.length - 1]?.id;

  const [prevInitialTweets, setPrevInitialTweets] = React.useState(initialTweets);
  if (prevInitialTweets !== initialTweets && initialTweets.length > 0) {
    setPrevInitialTweets(initialTweets);
    dispatch({ type: "update_latest_tweet", newInitialTweets: initialTweets });
  }

  React.useEffect(() => {
    const updateTweets = async () => {
      if (isLoading || isLastPage) {
        return;
      }
      setIsLoading(true);
      const nextTweets = await fetchNextUserTweetsPage(username, lastTweetId);
      setIsLoading(false);
      dispatch({ type: "add_tweets", newTweets: nextTweets });
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
