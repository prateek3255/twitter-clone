import { BackButton } from "components/BackButton";
import { ProfileUsername } from "./components/ProfileUsername";

export default function NotFound() {
  return (
    <>
        <div className="h-14 w-full px-4 flex gap-5 items-center">
          <BackButton />
          <div className="flex flex-col">
            <span className="text-white text-xl font-bold">Profile</span>
          </div>
        </div>

        <div className="max-w-[600px] w-full h-[200px] bg-gray-700" />

        <div className="relative pt-3 px-4">
          <div className="absolute top-[-67px] left-4">
            <div className="rounded-full bg-gray-800 h-[134px] w-[134px] border-4 border-solid border-black" />
          </div>
          <div className="h-[67px]" />
          <div className="flex flex-col mb-3">
            <span className="text-white text-xl font-extrabold">
              @<ProfileUsername />
            </span>
          </div>

          <div className="flex flex-col gap-2 max-w-[330px] mx-auto mt-16">
            <span className="text-white text-3xl font-extrabold">
              This account doesn’t exist
            </span>
            <span className="text-gray-500 text-sm">
              Try searching for another.
            </span>
          </div>
        </div>
      </>
  );
}
