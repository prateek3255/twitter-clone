import { Tweet } from "components/Tweet";
import { DEFAULT_PROFILE_IMAGE } from "constants/user";
import { getTweetsByUsername } from "utils/tweet";
import { getUserProfile } from "utils/user";

const TabItem = ({
  isActive = false,
  children,
}: {
  isActive?: boolean;
  children: React.ReactNode;
}) => (
  <a
    href="/"
    role="tab"
    aria-selected={isActive}
    className="min-w-[56px] w-full flex justify-center hover:bg-gray-100/10"
  >
    <div
      className={`py-4 text-sm relative ${
        isActive ? "font-bold text-white" : "font-semibold text-gray-500"
      }`}
    >
      {children}
      {isActive && (
        <div className="absolute bottom-0 bg-primary-blue h-1 w-full rounded-full" />
      )}
    </div>
  </a>
);

export default async function Profile({
  params: { username },
}: {
  params: { username: string };
}) {
  const [userProfile, tweets] = await Promise.all([
    getUserProfile(username),
    getTweetsByUsername(username),
  ]);
  return (
    <>
      {/** Tab bars */}
      <div
        role="tablist"
        className="flex mt-3 border-b border-solid border-gray-700"
      >
        <TabItem isActive>Tweets</TabItem>
        <TabItem>Replies</TabItem>
        <TabItem>Media</TabItem>
        <TabItem>Likes</TabItem>
      </div>
      {/** Tweets */}
      <div>
        {tweets.map((tweet) => (
          <Tweet
            key={tweet.id}
            username={username}
            name={userProfile?.name ?? ""}
            content={tweet.content}
            profileImage={userProfile?.profileImage ?? DEFAULT_PROFILE_IMAGE}
            timestamp={tweet.createdAt}
          />
        ))}
      </div>
    </>
  );
}
