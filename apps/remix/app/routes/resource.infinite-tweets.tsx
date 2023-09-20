import React, { Suspense } from "react";
import { json, redirect } from "@remix-run/node";
import type { SerializeFrom, LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/node";
import { Spinner, Retweet } from "ui";
import { formatDistanceForTweet } from "~/utils/common";
import { formatDistanceToNowStrict, parseISO } from "date-fns";
import type { FetcherWithComponents } from "@remix-run/react";
import {
  useFetcher,
  Link,
  useNavigate,
  Await,
  Form,
  useNavigation,
} from "@remix-run/react";
import type { TweetWithMeta } from "~/utils/tweets.server";
import { useIntersectionObserver } from "~/hooks/useIntersectionObserver";
import type { LoggedInUserBaseInfo } from "~/types/common";
import {
  getHomeTweets,
  getTweetReplies,
  getTweetsByUsername,
  getUserLikes,
  getUserReplies,
} from "~/utils/tweets.server";
import { TweetAction } from "~/components/TweetAction";
import { ReplyModal } from "~/components/ReplyModal";
import { DEFAULT_PROFILE_IMAGE } from "~/constants/user";
import { getUserSession } from "~/utils/auth.server";
import {
  toggleTweetLike,
  toggleTweetRetweet,
  replyToTweet,
} from "~/utils/tweet.server";
import { usePrevious } from "~/hooks/usePrevious";

type InfiniteTweetsParams =
  | { type: "user_tweets"; username: string }
  | { type: "home_timeline" }
  | { type: "tweet_replies"; tweetId: string }
  | { type: "user_replies"; username: string }
  | { type: "user_likes"; username: string };

type InfiniteTweetType = InfiniteTweetsParams["type"];

const getSearchParam = (url: string, param: string) =>
  new URL(url).searchParams.get(param);

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const cursor = getSearchParam(request.url, "cursor") ?? undefined;
  const type = getSearchParam(request.url, "type") as InfiniteTweetType;
  const username = getSearchParam(request.url, "username");
  const tweetId = getSearchParam(request.url, "tweetId");

  let tweets: Array<TweetWithMeta> = [];
  switch (type) {
    case "user_tweets":
      tweets = await getTweetsByUsername(request, username as string, cursor);
      break;
    case "home_timeline":
      tweets = await getHomeTweets(request, cursor);
      break;
    case "tweet_replies":
      tweets = await getTweetReplies(request, tweetId as string, cursor);
      break;
    case "user_replies":
      tweets = await getUserReplies(request, username as string, cursor);
      break;
    case "user_likes":
      tweets = await getUserLikes(request, username as string, cursor);
      break;
  }

  const tweetsWithStringifiedDate = tweets.map((tweet) => ({
    ...tweet,
    createdAt: tweet.createdAt.toISOString(),
  }));

  return json(
    {
      tweets: tweetsWithStringifiedDate,
    },
    200
  );
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const action = formData.get("_action");
  const userId = await getUserSession(request);

  if (!userId) {
    return redirect("/signin", 302);
  }

  switch (action) {
    case "toggle_tweet_like":
      {
        const tweetId = formData.get("tweetId") as string;
        const hasLiked = formData.get("hasLiked") === "true";
        await toggleTweetLike({
          request,
          tweetId,
          hasLiked,
        });
      }
      break;
    case "toggle_tweet_retweet":
      {
        const tweetId = formData.get("tweetId") as string;
        const hasRetweeted = formData.get("hasRetweeted") === "true";
        await toggleTweetRetweet({
          request,
          tweetId,
          hasRetweeted,
        });
      }
      break;
    case "reply_to_tweet":
      {
        const replyToTweetId = formData.get("replyToTweetId") as string;
        const content = formData.get("tweet") as string;
        await replyToTweet({
          request,
          replyToTweetId,
          content,
        });
      }
      break;
  }

  return redirect(request.headers.get("Referer") ?? "/");
};

export const shouldRevalidate = () => false;

type LoaderTweets = NonNullable<
  FetcherWithComponents<SerializeFrom<typeof loader>>["data"]
>["tweets"];

const mapToTweet = (tweets: LoaderTweets, isLoggedIn: boolean) => {
  return tweets.map((tweet) => {
    // In case of retweeted tweet, we add the info related to the
    // original tweet to the tweet object.
    if (tweet.retweetOf) {
      return {
        id: tweet.id,
        content: tweet.retweetOf.content,
        createdAt: tweet.retweetOf.createdAt,
        name: tweet.retweetOf.author.name ?? "",
        profileImage: tweet.retweetOf.author.profileImage,
        username: tweet.retweetOf.author.username,
        likes: tweet.retweetOf._count.likes,
        replies: tweet.retweetOf._count.replies,
        retweets: tweet.retweetOf._count.retweets,
        hasLiked: tweet.retweetOf.likes.length > 0 && isLoggedIn,
        hasRetweeted: tweet.retweetOf.retweets.length > 0 && isLoggedIn,
        originalTweetId: tweet.retweetOf.id,
        retweetAuthor: tweet.author,
      };
    }

    return {
      id: tweet.id,
      content: tweet.content,
      createdAt: tweet.createdAt,
      name: tweet.author.name ?? "",
      profileImage: tweet.author.profileImage,
      username: tweet.author.username,
      likes: tweet._count.likes,
      replies: tweet._count.replies,
      retweets: tweet._count.retweets,
      hasLiked: tweet.likes.length > 0 && isLoggedIn,
      hasRetweeted: tweet.retweets.length > 0 && isLoggedIn,
      originalTweetId: null,
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
      tweetId: string;
    }
  | {
      type: "toggle_tweet_retweet";
      tweetId: string;
    }
  | {
      type: "add_reply";
      tweetId: string;
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
    case "add_reply":
      return {
        ...state,
        tweets: state.tweets.map((tweet) => {
          if (tweet.id === action.tweetId) {
            return {
              ...tweet,
              replies: tweet.replies + 1,
            };
          }
          return tweet;
        }),
      };
    default:
      return state;
  }
};

type InfiniteTweetsProps = InfiniteTweetsParams & {
  initialTweets: LoaderTweets;
  currentLoggedInUser?: LoggedInUserBaseInfo;
  isUserProfile?: boolean;
};

export const InfiniteTweets = ({
  initialTweets,
  currentLoggedInUser,
  isUserProfile = false,
  type,
  ...rest
}: InfiniteTweetsProps) => {
  const isLoggedIn = !!currentLoggedInUser;
  const [{ tweets, isLastPage }, dispatch] = React.useReducer(reducer, {
    tweets: mapToTweet(initialTweets, isLoggedIn),
    isLastPage: false,
  });
  const [shouldFetch, setShouldFetch] = React.useState(true);
  const endOfTweetsRef = React.useRef<HTMLDivElement>(null);
  const entry = useIntersectionObserver(endOfTweetsRef, {});
  const isVisible = !!entry?.isIntersecting;
  const lastTweetId = tweets[tweets.length - 1]?.id;
  const fetcher = useFetcher<typeof loader>();
  const isLoading = fetcher.state !== "idle";

  const [prevInitialTweets, setPrevInitialTweets] =
    React.useState(initialTweets);
  if (prevInitialTweets !== initialTweets && initialTweets.length > 0) {
    setPrevInitialTweets(initialTweets);
    dispatch({
      type: "update_latest_tweet",
      newInitialTweets: mapToTweet(initialTweets, isLoggedIn),
    });
  }

  React.useEffect(() => {
    if (fetcher.data && Array.isArray(fetcher.data.tweets)) {
      dispatch({
        type: "add_tweets",
        newTweets: mapToTweet(fetcher.data.tweets, isLoggedIn),
      });
      setShouldFetch(true);
    }
  }, [fetcher.data, isLoggedIn]);

  React.useEffect(() => {
    if (isLoading || isLastPage || !isVisible || !shouldFetch) {
      return;
    }
    fetcher.submit(
      {
        type,
        cursor: lastTweetId,
        ...rest,
      },
      {
        method: "GET",
        action: "/resource/infinite-tweets",
      }
    );
    setShouldFetch(false);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isVisible,
    lastTweetId,
    isLoading,
    isLastPage,
    isLoggedIn,
    type,
    shouldFetch,
  ]);

  const handleLikeClick = React.useCallback((tweetId: string) => {
    dispatch({
      type: "toggle_tweet_like",
      tweetId,
    });
  }, []);

  const handleRetweetClick = React.useCallback((tweetId: string) => {
    dispatch({
      type: "toggle_tweet_retweet",
      tweetId,
    });
  }, []);

  const handleReplySuccess = React.useCallback((tweetId: string) => {
    dispatch({
      type: "add_reply",
      tweetId,
    });
  }, []);

  return (
    <>
      {tweets.map((tweet) => (
        <Tweet
          key={tweet.id}
          {...tweet}
          onRetweetClick={handleRetweetClick}
          onLikeClick={handleLikeClick}
          onReplySuccess={handleReplySuccess}
          currentLoggedInUser={currentLoggedInUser}
          showOwnRetweet={isUserProfile}
        />
      ))}
      <div className="h-1" ref={endOfTweetsRef} />
      {isLoading && <Spinner />}
    </>
  );
};

interface BaseTweetProps {
  username: string;
  name: string;
  profileImage?: string | null;
  content: string;
  createdAt: string;
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
    showOwnRetweet,
  } = props;
  const [isReplyModalOpen, setIsReplyModalOpen] = React.useState(false);
  const isRetweet = typeof props.originalTweetId === "string";
  const originalTweetId = props.originalTweetId ?? id;
  const navigate = useNavigate();
  const navigation = useNavigation();
  const [currentAction, setCurrentAction] = React.useState<
    "like" | "retweet" | undefined
  >(undefined);
  const isLoading = navigation.state !== "idle";
  const prevLoading = usePrevious(isLoading);

  const handleTweetClick = () => {
    const isTextSelected = window.getSelection()?.toString();
    if (isTextSelected) return;
    navigate(`/status/${id}`);
  };

  // This is to trigger the client side update when the user
  // clicks on the like or retweet button and the navigation
  // is finished. Figure out if there's a better way to do this.
  React.useEffect(() => {
    if (
      prevLoading !== isLoading &&
      !isLoading &&
      typeof currentAction === "string"
    ) {
      if (currentAction === "like") {
        onLikeClick?.(id);
      } else if (currentAction === "retweet") {
        onRetweetClick?.(id);
      }
      setCurrentAction(undefined);
    }
  }, [currentAction, id, isLoading, onLikeClick, onRetweetClick, prevLoading]);

  const showRetweetedBy = showOwnRetweet
    ? hasRetweeted || isRetweet
    : isRetweet;

  const closeReplyModal = React.useCallback(() => {
    setIsReplyModalOpen(false);
  }, []);

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
          <img
            src={profileImage ?? DEFAULT_PROFILE_IMAGE}
            width={48}
            height={48}
            className="rounded-full max-h-[48px]"
            alt={`${username}'s avatar`}
          />
          <div className="flex flex-col w-full">
            <div className="flex items-center gap-1">
              <Link
                to={`/${username}`}
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
                {formatDistanceForTweet(
                  formatDistanceToNowStrict(
                    typeof createdAt === "string"
                      ? parseISO(createdAt)
                      : createdAt
                  )
                )}
              </span>
            </div>
            <div className="flex flex-col gap-3">
              <span className="text-white text-sm">{content}</span>
              <div className="flex max-w-[342px] w-full justify-between pr-8">
                <TweetAction
                  size="compact"
                  type="reply"
                  disabled={isLoading}
                  count={replies}
                  action={() => setIsReplyModalOpen(true)}
                />
                <Form method="post" action="/resource/infinite-tweets">
                  <input type="hidden" name="tweetId" value={id} />
                  <input
                    type="hidden"
                    name="hasRetweeted"
                    value={(!hasRetweeted).toString()}
                  />
                  <TweetAction
                    size="compact"
                    type="retweet"
                    active={hasRetweeted}
                    count={retweets}
                    disabled={isLoading}
                    submit
                    name="_action"
                    value="toggle_tweet_retweet"
                    action={() => {
                      setCurrentAction("retweet");
                    }}
                  />
                </Form>
                <Form method="post" action="/resource/infinite-tweets">
                  <input type="hidden" name="tweetId" value={id} />
                  <input
                    type="hidden"
                    name="hasLiked"
                    value={(!hasLiked).toString()}
                  />
                  <TweetAction
                    size="compact"
                    active={hasLiked}
                    type="like"
                    count={likes}
                    disabled={isLoading}
                    submit
                    name="_action"
                    value="toggle_tweet_like"
                    action={() => {
                      setCurrentAction("like");
                    }}
                  />
                </Form>
              </div>
            </div>
          </div>
        </div>
      </article>
      <ReplyModal
        isOpen={isReplyModalOpen}
        closeModal={closeReplyModal}
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

type SuspendedInfiniteTweetsProps = InfiniteTweetsParams & {
  initialTweetsPromise: Promise<LoaderTweets>;
  currentLoggedInUser?: LoggedInUserBaseInfo;
  isUserProfile?: boolean;
};

export const SuspendedInfiniteTweets = (
  props: SuspendedInfiniteTweetsProps
) => {
  return (
    <Suspense fallback={<Spinner />}>
      <Await
        resolve={props.initialTweetsPromise}
        errorElement={<p>Something went wrong!</p>}
      >
        {(initialTweets) => (
          <InfiniteTweets {...props} initialTweets={initialTweets} />
        )}
      </Await>
    </Suspense>
  );
};
