"use client";
import React from "react";
import { Tweet } from "components/Tweet";
import type { TweetWithMeta } from "utils/tweet";
import { useIntersectionObserver } from "hooks/useIntesectionObserver";
import { fetchNextUserTweetsPage } from "app/actions";
import { Spinner } from "components/Spinner";

const mapToTweet = (
  tweets: Array<TweetWithMeta>,
  userInfo: { name?: string | null; profileImage: string; username: string }
) => {
  return tweets.map((tweet) => {
    // In case of retweeted tweet, we add the info related to the
    // original tweet to the tweet object.
    if (tweet.retweetOf) {
      return {
        id: tweet.retweetOf.id,
        content: tweet.retweetOf.content,
        createdAt: tweet.retweetOf.createdAt,
        name: tweet.retweetOf.author.name ?? "",
        profileImage: tweet.retweetOf.author.profileImage ?? "",
        username: tweet.retweetOf.author.username,
        likes: tweet.retweetOf._count.likes,
        replies: tweet.retweetOf._count.replies,
        retweets: tweet.retweetOf._count.retweets,
        hasLiked: tweet.retweetOf.likes.length > 0,
        hasRetweeted: tweet.retweets.length > 0,
      };
    }

    return {
      id: tweet.id,
      content: tweet.content,
      createdAt: tweet.createdAt,
      name: userInfo.name ?? "",
      profileImage: userInfo.profileImage,
      username: userInfo.username,
      likes: tweet._count.likes,
      replies: tweet._count.replies,
      retweets: tweet._count.retweets,
      hasLiked: tweet.likes.length > 0,
      hasRetweeted: tweet.retweets.length > 0,
    };
  });
};

type TweetType = ReturnType<typeof mapToTweet>[number];

type State = {
  tweets: Array<TweetType>;
  isLastPage: boolean;
};

type Action =
  | {
      type: "add_tweets";
      newTweets: Array<TweetType>;
    }
  | {
      type: "update_latest_tweet";
      newInitialTweets: Array<TweetType>;
    }
  | {
      type: "toggle_tweet_like";
      tweetId: number;
      currentLoggedInUserId: number;
    }
  | {
      type: "toggle_tweet_retweet";
      tweetId: number;
      currentLoggedInUserId: number;
    };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "add_tweets":
      return {
        ...state,
        tweets: [...state.tweets, ...action.newTweets],
        isLastPage: action.newTweets.length === 0,
      };
    case "update_latest_tweet":
      const newTweets = action.newInitialTweets.filter(
        (tweet) => !state.tweets.some((t) => t.id === tweet.id)
      );
      return {
        ...state,
        tweets: [...newTweets, ...state.tweets],
      };
    case "toggle_tweet_like":
      return {
        ...state,
        tweets: state.tweets.map((tweet) => {
          if (tweet.id === action.tweetId) {
            return {
              ...tweet,
              hasLiked: !tweet.hasLiked,
              likes: tweet.hasLiked ? tweet.likes - 1 : tweet.likes + 1,
            };
          }
          return tweet;
        }),
      };
    case "toggle_tweet_retweet":
      return {
        ...state,
        tweets: state.tweets.map((tweet) => {
          if (tweet.id === action.tweetId) {
            return {
              ...tweet,
              hasRetweeted: !tweet.hasRetweeted,
              retweets: tweet.hasRetweeted
                ? tweet.retweets - 1
                : tweet.retweets + 1,
            };
          }
          return tweet;
        }),
      };
    default:
      return state;
  }
};

export const InfiniteUserTweets = ({
  initialTweets,
  username,
  profileImage,
  name,
  currentLoggedInUserId,
}: {
  initialTweets: Array<TweetWithMeta>;
  username: string;
  profileImage: string;
  name?: string | null;
  currentLoggedInUserId?: number;
}) => {
  const [{ tweets, isLastPage }, dispatch] = React.useReducer(reducer, {
    tweets: mapToTweet(initialTweets, { name, profileImage, username }),
    isLastPage: false,
  });
  const [isLoading, setIsLoading] = React.useState(false);
  const endOfTweetsRef = React.useRef<HTMLDivElement>(null);
  const entry = useIntersectionObserver(endOfTweetsRef, {});
  const isVisible = !!entry?.isIntersecting;
  const lastTweetId = tweets[tweets.length - 1]?.id;

  const [prevInitialTweets, setPrevInitialTweets] =
    React.useState(initialTweets);
  if (prevInitialTweets !== initialTweets && initialTweets.length > 0) {
    setPrevInitialTweets(initialTweets);
    dispatch({
      type: "update_latest_tweet",
      newInitialTweets: mapToTweet(initialTweets, {
        name,
        profileImage,
        username,
      }),
    });
  }

  React.useEffect(() => {
    const updateTweets = async () => {
      if (isLoading || isLastPage) {
        return;
      }
      setIsLoading(true);
      const nextTweets = await fetchNextUserTweetsPage(username, lastTweetId);
      setIsLoading(false);
      dispatch({
        type: "add_tweets",
        newTweets: mapToTweet(nextTweets, { name, profileImage, username }),
      });
    };
    if (isVisible) {
      updateTweets();
    }
  }, [
    isVisible,
    username,
    lastTweetId,
    isLoading,
    isLastPage,
    name,
    profileImage,
  ]);

  return (
    <>
      {tweets.map((tweet) => (
        <Tweet
          key={tweet.id}
          {...tweet}
          onRetweetClick={(tweetId) => {
            dispatch({
              type: "toggle_tweet_retweet",
              tweetId,
              currentLoggedInUserId: currentLoggedInUserId ?? 0,
            });
          }}
          onLikeClick={(tweetId) => {
            dispatch({
              type: "toggle_tweet_like",
              tweetId,
              currentLoggedInUserId: currentLoggedInUserId ?? 0,
            });
          }}
        />
      ))}
      <div className="h-1" ref={endOfTweetsRef} />
      {isLoading && <Spinner />}
    </>
  );
};
