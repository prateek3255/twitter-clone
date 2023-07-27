"use client";
import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ThreeDots, ChevronDown } from "ui/icons";
import { Popover } from "@headlessui/react";

const ProfileButton = ({
  name,
  username,
  logOut,
    profileImage,
}: {
  name: string;
  username: string;
  profileImage: string;
  logOut: () => Promise<void>;
}) => {
  const router = useRouter();

  return (
    <Popover className="relative">
      <Popover.Button className="flex justify-between w-full items-center p-3 rounded-full hover:bg-gray-100/10">
        <div className="flex gap-3 items-center">
          <Image
            src={profileImage}
            className="rounded-full object-contain max-h-[40px]"
            width={40}
            height={40}
            alt="Prateek's profile image"
          />
          <div className="flex flex-col items-start text-white">
            <span className="font-semibold text-base">{name}</span>
            <span className="text-gray-500 text-sm">@{username}</span>
          </div>
        </div>
        <div className=" text-white">
          <ThreeDots />
        </div>
      </Popover.Button>
      <Popover.Panel className="bg-black rounded-2xl absolute z-10 transform left-0 bottom-[84px] py-2 w-[300px] shadow-[rgba(255,_255,_255,_0.2)_0px_0px_15px,_rgba(255,_255,_255,_0.15)_0px_0px_3px_1px]">
        <button
          className="text-white text-left text-base rounded-lg font-bold w-full hover:bg-gray-100/10 py-3 px-4"
          onClick={async () => {
            await logOut();
            router.push("/signin");
          }}
        >
          Log out @{username}
        </button>
        <ChevronDown className="text-black absolute left-[20px] bottom-[-11px] rotate-180 drop-shadow-[rgb(51,_54,_57)_1px_-1px_1px]" />
      </Popover.Panel>
    </Popover>
  );
};

export { ProfileButton };
