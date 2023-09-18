"use client";
import React, { useEffect } from "react";
import { format, parseISO } from "date-fns";
import type { LoggedInUserBaseInfo, TweetBaseInfo } from "~/types/common";
import { DEFAULT_PROFILE_IMAGE } from "~/constants/user";
import { ButtonOrLink } from "./ButtonOrLink";
import { DialogWithClose } from "./DialogWithClose";
import { Form, useNavigation } from "@remix-run/react";

const ReplyModal = ({
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
  const textAreaRef = React.useRef<HTMLTextAreaElement>(null);
  const navigation = useNavigation();
  const isLoading = navigation.state === "submitting";

  useEffect(() => {
    if (!isLoading) {
      closeModal();
    }
  }, [isLoading, closeModal]);

  return (
    <DialogWithClose
      isOpen={isOpen}
      closeModal={closeModal}
      initialFocus={textAreaRef}
      title="Tweet your reply"
    >
      <div className="flex gap-3 w-full mt-4">
        <div className="flex flex-col items-center">
          <img
            src={originalTweet.profileImage ?? DEFAULT_PROFILE_IMAGE}
            width={40}
            height={40}
            className="rounded-full min-h-[40px] min-w-[40px]"
            alt={`${originalTweet.username}'s avatar`}
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
              <time dateTime={`${originalTweet.createdAt}`}>
                {format(
                  typeof originalTweet.createdAt === "string"
                    ? parseISO(originalTweet.createdAt)
                    : originalTweet.createdAt,
                  "h:mm a · MMM d, yyyy"
                )}
              </time>
            </span>
          </div>
          <div className="flex flex-col gap-3">
            <span className="text-white text-sm">{originalTweet.content}</span>
          </div>
        </div>
      </div>
      <Form method="post" action="/resource/infinite-tweets">
        <div className="flex mt-2">
          <img
            src={currentLoggedInUser?.profileImage ?? DEFAULT_PROFILE_IMAGE}
            className="rounded-full object-contain max-h-[40px]"
            width={40}
            height={40}
            alt={`${
              currentLoggedInUser?.name ?? currentLoggedInUser?.username
            }'s avatar`}
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
          <input type="hidden" name="replyToTweetId" value={originalTweet.id} />
        </div>
        <div className="flex mt-3 border-t border-solid border-gray-700 pt-3 justify-end w-full">
          <ButtonOrLink
            variant="primary"
            size="small"
            type="submit"
            disabled={isLoading}
            name="_action"
            value="reply_to_tweet"
            onClick={() => {
              onReply?.();
            }}
          >
            Tweet
          </ButtonOrLink>
        </div>
      </Form>
    </DialogWithClose>
  );
};

export { ReplyModal };
