import Image from "next/image";
import { getCurrentLoggedInUser, getUserProfile } from "utils/user";
import { DEFAULT_PROFILE_IMAGE } from "constants/user";
import { BackButton } from "components/BackButton";
import { FollowButton } from "./components/FollowButton";
import { EditProfile } from "./components/EditProfile";
import { TabItem } from "./components/TabItem";

const FollowCount = ({ count, label }: { count: number; label: string }) => (
  <a href="#" className="hover:underline decoration-white">
    <span className="text-white font-bold text-sm">{count} </span>
    <span className="text-gray-500 text-sm">{label}</span>
  </a>
);

type UserProfile = NonNullable<Awaited<ReturnType<typeof getUserProfile>>>;

const UserProfileDetails = ({ userProfile }: { userProfile: UserProfile }) => {
  return (
    <>
      {/* Bio */}
      <div>
        <span className="text-white text-sm">{userProfile.bio}</span>
      </div>
      {/* Follower/Following count */}
      <div className="flex gap-5 mt-3">
        <FollowCount count={userProfile._count.following} label="Following" />
        <FollowCount count={userProfile._count.followers} label="Followers" />
      </div>
      {/** Tab bars */}
      <div
        role="tablist"
        className="flex mt-3 border-b border-solid border-gray-700 mx-[-16px]"
      >
        <TabItem href={`/${userProfile.username}`}>Tweets</TabItem>
        <TabItem href={`/${userProfile.username}/replies`}>Replies</TabItem>
        <TabItem href={`/${userProfile.username}/likes`}>Likes</TabItem>
      </div>
    </>
  );
};

export default async function Profile({
  params: { username },
  children,
}: {
  params: { username: string };
  children: React.ReactNode;
}) {
  const [user, currentLoggedInUser] = await Promise.all([
    getUserProfile(username),
    getCurrentLoggedInUser(),
  ]);
  const doesUserExist = user !== null;
  const isLoggedInUserFollowingProfile =
    user?.followers?.find(({ id }) => id === currentLoggedInUser?.id) !==
    undefined;
  const isCurrentUser = currentLoggedInUser?.username === user?.username;

  return (
    <>
      {/* Header */}
      <div className="h-14 w-full px-4 flex gap-5 items-center">
        <BackButton />
        <div className="flex flex-col">
          <span className="text-white text-xl font-bold">
            {user?.name ?? user?.username ?? "Profile"}
          </span>
          {doesUserExist && (
            <span className="text-gray-500 text-sm">
              {user._count.tweets} Tweets
            </span>
          )}
        </div>
      </div>
      {/* Cover Image */}
      {doesUserExist ? (
        <div className="max-w-[600px] w-full h-[200px] bg-gradient-to-r from-cyan-500 to-blue-500" />
      ) : (
        <div className="max-w-[600px] w-full h-[200px] bg-gray-700" />
      )}

      <div className="relative pt-3 px-4">
        <div className="absolute top-[-67px] left-4">
          {/* Profile Image */}
          {doesUserExist ? (
            <Image
              src={user?.profileImage ?? DEFAULT_PROFILE_IMAGE}
              className="rounded-full object-contain max-h-[134px] border-4 border-solid border-black"
              width={134}
              height={134}
              priority
              alt={`${user.username}'s profile image`}
            />
          ) : (
            <div className="rounded-full bg-gray-800 h-[134px] w-[134px] border-4 border-solid border-black" />
          )}
        </div>
        <div className=" h-[67px] flex w-full justify-end items-start">
          {doesUserExist &&
            (isCurrentUser ? (
              <EditProfile
                username={user.username}
                bio={user.bio}
                name={user.name}
              />
            ) : (
              <FollowButton
                profileUserId={user.id}
                isFollowing={isLoggedInUserFollowingProfile}
              />
            ))}
        </div>
        {/* Name */}
        <div className="flex flex-col mb-3">
          <span className="text-white text-xl font-extrabold">
            {doesUserExist ? user?.name : `@${username}`}
          </span>
          {doesUserExist && (
            <span className="text-gray-500 text-sm">@{user.username}</span>
          )}
        </div>
        {doesUserExist && <UserProfileDetails userProfile={user} />}
        {!doesUserExist && (
          <div className="flex flex-col gap-2 max-w-[330px] mx-auto mt-16">
            <span className="text-white text-3xl font-extrabold">
              This account doesn’t exist
            </span>
            <span className="text-gray-500 text-sm">
              Try searching for another.
            </span>
          </div>
        )}
      </div>
      {doesUserExist && children}
    </>
  );
}
