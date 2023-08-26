import Image from "next/image";
import { CreateTweetHomePage } from "./components/CreateTweetHomePage";
import { getCurrentLoggedInUser } from "utils/user";
import { DEFAULT_PROFILE_IMAGE } from "constants/user";
import { InfiniteTweets } from "components/InfiniteTweets";
import { getHomeTweets } from "utils/tweet";

export default async function Home() {
  const user = await getCurrentLoggedInUser();
  const initialTweets = await getHomeTweets();

  const fetchNextPage = async (cursor: string) => {
    "use server";
    const tweets = await getHomeTweets(cursor);
    return tweets;
  }


  return (
    <>
      <div className="p-4 border-b border-solid border-gray-700 w-full">
        <h1 className="text-white font-bold text-xl">Home</h1>
      </div>
      {user && (
        <div className="flex p-4 border-b border-solid border-gray-700">
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
