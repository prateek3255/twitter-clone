"use client";
import React from "react";
import { format } from "date-fns";
import Image from "next/image";
import { Dialog, Transition } from "@headlessui/react";
import { LoggedInUserBaseInfo, TweetBaseInfo } from "types/common";
import { Cross } from "ui/icons";
import { DEFAULT_PROFILE_IMAGE } from "constants/user";
import { replyToTweet } from "../app/actions";
import { TweetCTA } from "./TweetCTA";

const ReplyModal = ({
  isOpen,
  closeModal,
  originalTweet,
  currentLoggedInUser,
}: {
  isOpen: boolean;
  closeModal: () => void;
  originalTweet: TweetBaseInfo;
  currentLoggedInUser?: LoggedInUserBaseInfo;
}) => {
  const [_, startTransition] = React.useTransition();
  const textAreaRef = React.useRef<HTMLTextAreaElement>(null);

  return (
    <Transition show={isOpen} as={React.Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        onClose={closeModal}
        initialFocus={textAreaRef}
      >
        <Transition.Child
          as={React.Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-[#5b708366]" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-start mt-4 justify-center p-4 text-center">
            <Transition.Child
              as={React.Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-xl transform overflow-hidden rounded-2xl bg-black p-4 text-left align-middle shadow-xl transition-all">
                <Dialog.Title className="sr-only">Post Your Reply</Dialog.Title>
                <button
                  className="text-white p-2 rounded-full hover:bg-gray-100/10"
                  onClick={closeModal}
                >
                  <Cross aria-label="Close modal" />
                </button>
                <div className="flex gap-3 w-full mt-4">
                  <div className="flex flex-col items-center">
                    <Image
                      src={originalTweet.profileImage ?? DEFAULT_PROFILE_IMAGE}
                      width={40}
                      height={40}
                      className="rounded-full min-h-[40px] min-w-[40px]"
                      alt={`${originalTweet.username}'s profile image`}
                    />
                    <div className="w-[2px] min-h-[24px] h-full bg-gray-700" />
                  </div>
                  <div className="flex flex-col w-full">
                    <div className="flex items-center gap-1">
                      <span className="text-white font-bold text-sm hover:underline">
                        {originalTweet.name}
                      </span>
                      <span className="text-gray-500 text-sm">
                        @{originalTweet.username}
                      </span>
                      <span className="text-gray-500 text-sm">·</span>
                      <span className="text-gray-500 text-sm">
                        <time
                          dateTime={`${originalTweet.createdAt.toISOString()}`}
                        >
                          {format(
                            originalTweet.createdAt,
                            "h:mm a · MMM d, yyyy"
                          )}
                        </time>
                      </span>
                    </div>
                    <div className="flex flex-col gap-3">
                      <span className="text-white text-sm">
                        {originalTweet.content}
                      </span>
                    </div>
                  </div>
                </div>
                <form
                  action={(formData) => {
                    startTransition(async () => {
                      const content = formData.get("tweet") as string;
                      await replyToTweet({
                        content,
                        replyToTweetId: originalTweet.id,
                      });
                      closeModal();
                    });
                  }}
                >
                  <div className="flex mt-2">
                    <Image
                      src={currentLoggedInUser?.profileImage ?? DEFAULT_PROFILE_IMAGE}
                      className="rounded-full object-contain max-h-[40px]"
                      width={40}
                      height={40}
                      alt={`${currentLoggedInUser?.name ?? currentLoggedInUser?.username}'s profile image`}
                    />
                    <label htmlFor="tweet" className="sr-only">
                      Tweet your reply
                    </label>
                    <textarea
                      id="tweet"
                      ref={textAreaRef}
                      name="tweet"
                      required
                      maxLength={280}
                      className="flex-1 ml-3 bg-transparent text-white text-xl resize-none h-32 outline-none mt-2 placeholder:text-gray-500"
                      placeholder="Tweet your reply!"
                    />
                  </div>
                  <div className="flex mt-3 border-t border-solid border-gray-700 pt-3 justify-end w-full">
                    <TweetCTA label="Reply" />
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export { ReplyModal };
