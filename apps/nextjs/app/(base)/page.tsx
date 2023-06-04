import Image from "next/image";
import { CreateTweetHomePage } from "./CreateTweetHomePage";

export default function Web() {
  return (
    <div className="w-full min-h-full max-w-[600px] border-r border-solid border-gray-700">
      <div className="p-4 border-b border-solid border-gray-700 w-full">
        <h1 className="text-white font-bold text-xl">Home</h1>
      </div>
      <div className="flex p-4 border-b border-solid border-gray-700">
        <Image
          src="https://pbs.twimg.com/profile_images/1608754757967183872/GJO7c_03_400x400.jpg"
          className="rounded-full object-contain max-h-[48px]"
          width={48}
          height={48}
          alt="Prateek's profile image"
        />
        <div className="flex-1 ml-3 mt-2">
          <CreateTweetHomePage />
        </div>
      </div>
    </div>
  );
}