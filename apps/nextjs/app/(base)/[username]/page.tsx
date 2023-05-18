import { BackButton } from "ui/icons";
import { ButtonOrLink } from "components/ButtonOrLink";
import Image from "next/image";
import { Tweet } from "../../../components/Tweet";

const FollowCount = ({ count, label }: { count: number; label: string }) => (
  <a href="/psuranas/followers" className="hover:underline decoration-white">
    <span className="text-white font-bold text-sm">{count} </span>
    <span className="text-gray-500 text-sm">{label}</span>
  </a>
);

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

export default function Profile() {
  return (
    <div className="w-full min-h-full max-w-[600px] border-r border-solid border-gray-700">
      {/* Header */}
      <div className="h-14 w-full px-4 flex items-center">
        <div className=" min-w-[56px] flex items-center">
          <button className="text-white p-2 rounded-full hover:bg-gray-100/10">
            <BackButton aria-label="Go back" />
          </button>
        </div>
        <div className="flex flex-col">
          <span className="text-white text-xl font-bold">Prateek Surana</span>
          <span className="text-gray-500 text-sm">1,153 Tweets</span>
        </div>
      </div>
      {/* Cover Image */}
      <Image
        src="https://pbs.twimg.com/profile_banners/723196595722809345/1682895978/1500x500"
        width={600}
        height={200}
        priority
        alt="cover image"
      />
      {/* Profile Image */}
      <div className="relative pt-3 px-4">
        <div className="absolute top-[-67px] left-4">
          <Image
            src="https://pbs.twimg.com/profile_images/1608754757967183872/GJO7c_03_400x400.jpg"
            className="rounded-full object-contain max-h-[134px] border-4 border-solid border-black"
            width={134}
            height={134}
            priority
            alt="Prateek's profile image"
          />
        </div>
        <div className=" h-[67px] flex w-full justify-end items-start">
          <ButtonOrLink variant="tertiary">Edit profile</ButtonOrLink>
        </div>
        {/* Name */}
        <div className="flex flex-col mb-3">
          <span className="text-white text-xl font-extrabold">
            Prateek Surana
          </span>
          <span className="text-gray-500 text-sm">@psuranas</span>
        </div>
        {/* Bio */}
        <div>
          <span className="text-white text-sm">
            Building Devfolio | Frontend Engineer | Writing @ prateeksurana.me
          </span>
        </div>
        {/* Follower/Following count */}
        <div className="flex gap-5 mt-3">
          <FollowCount count={1466} label="Following" />
          <FollowCount count={698} label="Followers" />
        </div>
      </div>
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
        <Tweet />
        <Tweet />
        <Tweet />
        <Tweet />
        <Tweet />
      </div>
    </div>
  );
}
