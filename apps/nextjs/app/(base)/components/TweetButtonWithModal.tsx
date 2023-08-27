"use client";
import React from "react";
import Image from "next/image";
import { Dialog, Transition } from "@headlessui/react";
import { ButtonOrLink } from "components/ButtonOrLink";
import { CreateTweetMobile, Cross } from "ui/icons";
import { createTweet } from "app/actions";
import { TweetCTA } from "components/TweetCTA";

export const TweetButton = ({ profileImage, loggedInUserName }: { profileImage: string, loggedInUserName: string }) => {
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
                  <Dialog.Title className="sr-only">Tweet</Dialog.Title>
                  <button
                    className="text-white p-2 rounded-full hover:bg-gray-100/10"
                    onClick={closeModal}
                  >
                    <Cross aria-label="Close modal" />
                  </button>
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
                        alt={`${loggedInUserName}'s profile image`}
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
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};
