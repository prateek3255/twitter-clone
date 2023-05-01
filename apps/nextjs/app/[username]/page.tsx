import { BackButton } from "ui/icons";
import { Button } from "ui";
import Image from "next/image";

export default function Profile() {
  return (
    <div className="w-full max-w-[600px] border-r border-solid border-gray-700">
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
      <Image
        src="https://pbs.twimg.com/profile_banners/723196595722809345/1682895978/1500x500"
        width={600}
        height={200}
        alt="cover image"
      />
      <div className="relative pt-3 px-4">
        <div className="absolute top-[-67px] left-4">
          <Image
            src="https://pbs.twimg.com/profile_images/1608754757967183872/GJO7c_03_400x400.jpg"
            className="rounded-full object-contain max-h-[134px] border-4 border-solid border-black"
            width={134}
            height={134}
            alt="Prateek's profile image"
          />
        </div>
        <div className=" h-[70px] flex w-full justify-end">
            <Button variant="teritary">
                Edit profile
            </Button>
        </div>
      </div>
    </div>
  );
}
