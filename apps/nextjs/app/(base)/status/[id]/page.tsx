import { BackButton } from "ui/icons";
import Image from "next/image";
import { DEFAULT_PROFILE_IMAGE } from "constants/user";
import { TweetActions } from "./components/TweetActions";

const TweetStat = ({
  label,
  count
}: {
  label: string;
  count: number;
}) => (
  <div className="flex gap-1">
    <span className="text-white font-bold text-sm">{count}</span>
    <span className="text-gray-500 text-sm">{label}</span>
  </div>
)

export default async function Web() {
  return (
    <div className="w-full min-h-full max-w-[600px] border-r border-solid border-gray-700">
      {/* Header */}
      <div className="h-14 w-full px-4 flex items-center">
        <div className="min-w-[56px] flex items-center">
          <button className="text-white p-2 rounded-full hover:bg-gray-100/10">
            <BackButton aria-label="Go back" />
          </button>
        </div>
        <span className="text-white text-xl font-bold">Tweet</span>
      </div>
      {/* Tweet large */}
      <article className="px-4">
        <div className="flex gap-3 w-full items-center pt-3 pb-2">
          <Image
            src={DEFAULT_PROFILE_IMAGE}
            width={48}
            height={48}
            className="rounded-full max-h-[48px]"
            alt={`{username}'s profile image`}
          />
          <div className="flex flex-col w-full">
            <span className="text-white font-bold text-sm">Prateek Surana</span>
            <span className="text-gray-500 text-sm">@prateek_2412</span>
          </div>
        </div>
        <div className="flex flex-col mt-2">
          <p className="text-white text-base">
            Released the long-due v3 for @devfolio react-otp-input. This update
            is a complete rewrite of the library and offers: - Smaller bundle
            size (~60% smaller!) - More customizability, with consumers now able
            to choose what to render - Full type safety for added peace of mind
          </p>
          <div className="py-4 text-gray-500 text-sm border-b border-solid border-gray-700">
            <time dateTime="2023-03-27T03:58:58.000Z">
              9:28 AM · Mar 27, 2023
            </time>
          </div>
        </div>
        <div className="py-4 flex gap-5 border-b border-solid border-gray-700">
          <TweetStat label="Likes" count={10} />
          <TweetStat label="Retweets" count={10} />
        </div>
        <TweetActions />
      </article>
    </div>
  );
}
