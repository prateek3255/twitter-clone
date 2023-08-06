"use client";
import React from "react";
import { createTweet } from "../../actions";
import { TweetCTA } from "./TweetCTA";

export const CreateTweetHomePage = () => {
  const formRef = React.useRef<HTMLFormElement>(null);
  const [_, startTransition] = React.useTransition();
  return (
    <form
      action={(formData) => {
        startTransition(async () => {
          await createTweet(formData);
          formRef.current?.reset();
        });
      }}
      ref={formRef}
    >
      <textarea
        name="tweet"
        required
        maxLength={280}
        className="bg-transparent w-full text-white text-xl resize-none h-24 outline-none placeholder:text-gray-500"
        placeholder="What's happening?"
      />
      <div className="flex border-t border-solid border-gray-700 pt-3 justify-end w-full">
        <TweetCTA />
      </div>
    </form>
  );
};
