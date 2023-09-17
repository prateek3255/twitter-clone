import React from "react";
import { redirect, type ActionArgs } from "@remix-run/node";
import { Form, useNavigation } from "@remix-run/react";
import { CreateTweetMobile } from "ui";
import { ButtonOrLink } from "~/components/ButtonOrLink";
import { DialogWithClose } from "~/components/DialogWithClose";
import { createTweet } from "~/utils/tweet.server";

export const action = async ({ request }: ActionArgs) => {
  const form = await request.formData();
  const tweet = form.get("tweet")?.toString() ?? "";

  await createTweet(request, tweet);
  // This is required to redirect to the same page from which
  // the request was made.
  return redirect(request.headers.get("Referer") ?? '/');
};

export const TweetButton = ({
  profileImage,
  loggedInUserName,
}: {
  profileImage: string;
  loggedInUserName: string;
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const textAreaRef = React.useRef<HTMLTextAreaElement>(null);
  const navigation = useNavigation();
  const isLoading = navigation.state === "submitting";

  React.useEffect(() => {
    if (!isLoading) {
      setIsOpen(false);
    }
  }, [isLoading]);

  const closeModal = () => {
    setIsOpen(false);
  };

  const openModal = () => {
    setIsOpen(true);
  };
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
        <Form method="post" action="/resource/create-tweet">
          <div className="flex mt-4">
            <img
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
            <ButtonOrLink
              variant="primary"
              size="small"
              type="submit"
              disabled={isLoading}
            >
              Tweet
            </ButtonOrLink>
          </div>
        </Form>
      </DialogWithClose>
    </>
  );
};
