"use client";
import React from "react";
import Image from "next/image";
import { ButtonOrLink } from "components/ButtonOrLink";
import { CreateTweetMobile } from "ui/icons";
import { createTweet } from "app/actions";
import { TweetCTA } from "components/TweetCTA";
import { DialogWithClose } from "components/DialogWithClose";

export const TweetButtonWithModal = ({
  profileImage,
  loggedInUserName,
}: {
  profileImage: string;
  loggedInUserName: string;
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [_, startTransition] = React.useTransition();
  const textAreaRef = React.useRef<HTMLTextAreaElement>(null);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }
  return (
    <>
      <ButtonOrLink
        className="mt-3 w-full sm:block hidden"
        size="large"
        variant="primary"
        onClick={openModal}
      >
        Tweet
      </ButtonOrLink>
      <ButtonOrLink
        className="sm:hidden block text-white pl-[14px] pr-[14px]"
        size="large"
        variant="primary"
        onClick={openModal}
      >
        <CreateTweetMobile />
        <span className="sr-only">Tweet</span>
      </ButtonOrLink>
      <DialogWithClose
        isOpen={isOpen}
        closeModal={closeModal}
        initialFocus={textAreaRef}
        title="Create a tweet"
      >
        <form
          action={(formData) => {
            startTransition(async () => {
              await createTweet(formData);
              closeModal();
            });
          }}
        >
          <div className="flex mt-4">
            <Image
              src={profileImage}
              className="rounded-full object-contain max-h-[48px]"
              width={48}
              height={48}
              alt={`${loggedInUserName}'s avatar`}
            />
            <label htmlFor="tweet" className="sr-only">
              Create a tweet
            </label>
            <textarea
              ref={textAreaRef}
              id="tweet"
              name="tweet"
              required
              maxLength={280}
              className="flex-1 ml-3 bg-transparent text-white text-xl resize-none h-32 outline-none mt-2 placeholder:text-gray-500"
              placeholder="What's happening?"
            />
          </div>
          <div className="flex mt-3 border-t border-solid border-gray-700 pt-3 justify-end w-full">
            <TweetCTA />
          </div>
        </form>
      </DialogWithClose>
    </>
  );
};
