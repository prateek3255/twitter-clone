"use client";
import React from "react";
import { format } from "date-fns";
import Image from "next/image";
import { LoggedInUserBaseInfo, TweetBaseInfo } from "types/common";
import { DEFAULT_PROFILE_IMAGE } from "constants/user";
import { replyToTweet } from "../app/actions";
import { TweetCTA } from "./TweetCTA";
import { DialogWithClose } from "./DialogWithClose";

export const ReplyModal = ({
  isOpen,
  closeModal,
  originalTweet,
  currentLoggedInUser,
  onReply,
}: {
  isOpen: boolean;
  closeModal: () => void;
  originalTweet: TweetBaseInfo;
  currentLoggedInUser?: LoggedInUserBaseInfo;
  onReply?: () => void;
}) => {
  const [_, startTransition] = React.useTransition();
  const textAreaRef = React.useRef<HTMLTextAreaElement>(null);

  return (
    <DialogWithClose
      isOpen={isOpen}
      closeModal={closeModal}
      initialFocus={textAreaRef}
      title="Tweet your reply"
    >
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
              <time dateTime={`${originalTweet.createdAt.toISOString()}`}>
                {format(originalTweet.createdAt, "h:mm a · MMM d, yyyy")}
              </time>
            </span>
          </div>
          <div className="flex flex-col gap-3">
            <span className="text-white text-sm">{originalTweet.content}</span>
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
            onReply?.();
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
            alt={`${
              currentLoggedInUser?.name ?? currentLoggedInUser?.username
            }'s profile image`}
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
    </DialogWithClose>
  );
};

