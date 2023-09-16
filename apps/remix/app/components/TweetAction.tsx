import { Reply, Retweet, RetweetFilled, Like, LikeFilled } from "ui";

type ActionType = "reply" | "retweet" | "like";

const TweetActionDetails = {
  reply: {
    icon: <Reply />,
    activeIcon: <Reply />,
    activeColor: "text-primary-blue",
    hoverBg: "hover:text-primary-blue [&_>_div_>_div]:hover:bg-primary-blue/10",
  },
  retweet: {
    icon: <Retweet />,
    activeIcon: <RetweetFilled />,
    activeColor: "text-primary-green",
    hoverBg:
      "hover:text-primary-green [&_>_div_>_div]:hover:bg-primary-green/10",
  },
  like: {
    icon: <Like />,
    activeIcon: <LikeFilled />,
    activeColor: "text-primary-red",
    hoverBg: "hover:text-primary-red [&_>_div_>_div]:hover:bg-primary-red/10",
  },
};

const ActiveLabel: Record<ActionType, string> = {
  reply: "Replied",
  retweet: "Retweeted",
  like: "Liked",
};

interface TweetActionPropsBase {
  type: ActionType;
  active?: boolean;
  disabled?: boolean;
  action: () => void;
  size: "compact" | "normal";
}

interface TweetActionPropsCompact extends TweetActionPropsBase {
  size: "compact";
  count: number;
}

interface TweetActionPropsNormal extends TweetActionPropsBase {
  size: "normal";
}

export type TweetActionProps = TweetActionPropsCompact | TweetActionPropsNormal;

const TweetAction = (props: TweetActionProps) => {
  const { icon, hoverBg, activeColor, activeIcon } = TweetActionDetails[props.type];
  return (
    <button
      aria-label={props.type}
      className={`flex items-center gap-3 ${
        props.active ? activeColor : "text-gray-500"
      } transition-colors ${hoverBg} disabled:opacity-50 disabled:cursor-not-allowed`}
      onClick={(event) => {
        event.stopPropagation();
        props.action();
      }}
      disabled={props.disabled}
    >
      <div className={`relative ${props.size === 'normal' ? '[&_>_svg]:w-6 [&_>_svg]:h-6' : ''}`}>
        <div className="absolute top-0 left-0 right-0 bottom-0 rounded-full m-[-8px] transition-colors"></div>
        {props.active ? activeIcon : icon}
      </div>
      {props.size === "compact" && (
        <>
          <span className="text-xs">{props.count}</span>
          <span className="sr-only">{`${props.count} ${props.type}s. ${
            props.active ? ActiveLabel[props.type] : ""
          }`}</span>
        </>
      )}
    </button>
  );
};

export { TweetAction };
