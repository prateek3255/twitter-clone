import Image from "next/image";
import { CreateTweetHomePage } from "./CreateTweetHomePage";
import { getCurrentLoggedInUser } from "utils/user";
import { DEFAULT_PROFILE_IMAGE } from "constants/user";

export default async function Web() {
  const user = await getCurrentLoggedInUser();
  return (
    <div className="w-full min-h-full max-w-[600px] border-r border-solid border-gray-700">
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
    </div>
  );
}
