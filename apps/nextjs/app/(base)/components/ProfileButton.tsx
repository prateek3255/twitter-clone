"use client";
import React from "react";
import Image from "next/image";
import { ThreeDots, ChevronDown } from "ui/icons";
import { Popover } from "@headlessui/react";
import { logout } from "../../actions";

const ProfileButton = ({
  name,
  username,
  profileImage,
}: {
  name: string;
  username: string;
  profileImage: string;
}) => {
  const [_, startTransition] = React.useTransition();
  return (
    <Popover className="relative">
      <Popover.Button className="flex justify-between sm:w-full items-center sm:p-3 rounded-full hover:bg-gray-100/10">
        <div className="flex gap-3 items-center">
          <Image
            src={profileImage}
            className="rounded-full object-contain sm:max-h-[40px] sm:max-w-[40px] max-h-[30px] max-w-[30px]"
            width={40}
            height={40}
            alt={`${name}'s avatar`}
          />
          <div className="hidden sm:flex flex-col items-start text-white">
            <span className="font-semibold text-base">{name}</span>
            <span className="text-gray-500 text-sm">@{username}</span>
          </div>
        </div>
        <div className="hidden sm:block text-white">
          <ThreeDots />
        </div>
      </Popover.Button>
      <Popover.Panel className="bg-black rounded-2xl absolute z-10 transform left-[-6px] sm:left-0 top-10 sm:top-[unset] sm:bottom-[84px] py-2 w-max sm:w-[300px] shadow-[rgba(255,_255,_255,_0.2)_0px_0px_15px,_rgba(255,_255,_255,_0.15)_0px_0px_3px_1px]">
        <button
          className="text-white text-left text-base rounded-lg font-bold w-full hover:bg-gray-100/10 py-3 px-4"
          onClick={() => {
            startTransition(async () => {
              await logout();
            });
          }}
        >
          Log out @{username}
        </button>
        <ChevronDown className="text-black absolute left-[12px] sm:left-[20px] top-[-12px] sm:top-[unset] sm:bottom-[-11px] sm:rotate-180 drop-shadow-[rgb(51,_54,_57)_1px_-1px_1px]" />
      </Popover.Panel>
    </Popover>
  );
};

export { ProfileButton };
