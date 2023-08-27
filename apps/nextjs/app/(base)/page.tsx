import Image from "next/image";
import { getCurrentLoggedInUser } from "utils/user";
import { TwitterLogo } from "ui/icons";
import { DEFAULT_PROFILE_IMAGE } from "constants/user";
import { InfiniteTweets } from "components/InfiniteTweets";
import { getHomeTweets } from "utils/tweet";
import { CreateTweetHomePage } from "./components/CreateTweetHomePage";
import { ProfileButton } from "./components/ProfileButton";
import { ButtonOrLink } from "components/ButtonOrLink";

export default async function Home() {
  const user = await getCurrentLoggedInUser();
  const initialTweets = await getHomeTweets();

  const fetchNextPage = async (cursor: string) => {
    "use server";
    const tweets = await getHomeTweets(cursor);
    return tweets;
  };

  return (
    <>
      <div className="p-4 border-b border-solid border-gray-700 w-full hidden sm:block">
        <h1 className="text-white font-bold text-xl">Home</h1>
      </div>
      <div className="flex flex-col gap-3 sm:hidden p-4 border-b border-solid border-gray-700 w-full">
        <div className="flex w-full items-center">
          <div className="flex-1 w-full">
            {user && (
              <ProfileButton
                name={user?.name ?? ""}
                username={user?.username ?? ""}
                profileImage={user?.profileImage ?? DEFAULT_PROFILE_IMAGE}
              />
            )}
          </div>
          <div className="flex-1 text-white flex justify-center">
            <TwitterLogo aria-label="Twitter logo" />
          </div>
          <div className="flex-1" />
        </div>
        {!user && (
          <div className="flex w-full gap-2">
            <ButtonOrLink stretch size="small" variant="primary" as="link" href="/signin">
              Log in
            </ButtonOrLink>
            <ButtonOrLink stretch size="small" variant="secondary" as="link" href="/signup">
              Sign up
            </ButtonOrLink>
          </div>
        )}
      </div>
      {user && (
        <div className="hidden sm:flex p-4 border-b border-solid border-gray-700">
          <Image
            src={user.profileImage ?? DEFAULT_PROFILE_IMAGE}
            className="rounded-full object-contain max-h-[48px]"
            width={48}
            height={48}
            alt="Prateek's profile image"
          />
          <div className="flex-1 ml-3 mt-2">
            <CreateTweetHomePage />
          </div>
        </div>
      )}
      <InfiniteTweets
        initialTweets={initialTweets}
        fetchNextPage={fetchNextPage}
        currentLoggedInUser={
          user
            ? {
                id: user.id,
                username: user.username,
                name: user.name ?? undefined,
                profileImage: user.profileImage,
              }
            : undefined
        }
      />
    </>
  );
}
