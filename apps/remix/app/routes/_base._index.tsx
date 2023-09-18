import { useEffect, useRef } from "react";
import { TwitterLogo, ThreeDots, ChevronDown } from "ui";
import { Popover } from "@headlessui/react";
import { type LoaderArgs, defer } from "@remix-run/node";
import { Form, useLoaderData, useNavigation } from "@remix-run/react";
import { DEFAULT_PROFILE_IMAGE } from "~/constants/user";
import { ButtonOrLink } from "~/components/ButtonOrLink";
import { getCurrentLoggedInUser } from "~/utils/user.server";
import { getHomeTweets } from "~/utils/tweets.server";
import { SuspendedInfiniteTweets } from "./resource.infinite-tweets";

export const loader = async ({ request }: LoaderArgs) => {
  return defer({
    user: await getCurrentLoggedInUser(request),
    tweets: getHomeTweets(request),
  });
};

export default function Home() {
  const { user, tweets } = useLoaderData<typeof loader>();
  const formRef = useRef<HTMLFormElement>(null);
  const navigation = useNavigation();
  const isLoading = navigation.state === "submitting";

  useEffect(() => {
    if (!isLoading) {
      formRef.current?.reset();
    }
  }, [isLoading]);

  return (
    <>
      {/* Desktop header */}
      <div className="p-4 border-b border-solid border-gray-700 w-full hidden sm:block">
        <h1 className="text-white font-bold text-xl">Home</h1>
      </div>
      {/* Mobile header */}
      <div className="flex flex-col gap-3 sm:hidden p-4 border-b border-solid border-gray-700 w-full">
        <div className="flex w-full items-center">
          <div className="flex-1 w-full">
            {user && (
              <Popover className="relative">
                <Popover.Button className="flex justify-between sm:w-full items-center sm:p-3 rounded-full hover:bg-gray-100/10">
                  <div className="flex gap-3 items-center">
                    <img
                      src={user.profileImage ?? DEFAULT_PROFILE_IMAGE}
                      className="rounded-full object-contain sm:max-h-[40px] sm:max-w-[40px] max-h-[30px] max-w-[30px]"
                      width={40}
                      height={40}
                      alt={`${user.name}'s avatar`}
                    />
                    <div className="hidden sm:flex flex-col items-start text-white">
                      <span className="font-semibold text-base">
                        {user.name}
                      </span>
                      <span className="text-gray-500 text-sm">
                        @{user.username}
                      </span>
                    </div>
                  </div>
                  <div className="hidden sm:block text-white">
                    <ThreeDots />
                  </div>
                </Popover.Button>
                <Popover.Panel className="bg-black rounded-2xl absolute z-10 transform left-[-6px] sm:left-0 top-10 sm:top-[unset] sm:bottom-[84px] py-2 w-max sm:w-[300px] shadow-[rgba(255,_255,_255,_0.2)_0px_0px_15px,_rgba(255,_255,_255,_0.15)_0px_0px_3px_1px]">
                  <form action="/" method="post">
                    <button
                      name="_action"
                      value="logout"
                      type="submit"
                      className="text-white text-left text-base rounded-lg font-bold w-full hover:bg-gray-100/10 py-3 px-4"
                    >
                      Log out @{user.username}
                    </button>
                  </form>
                  <ChevronDown className="text-black absolute left-[12px] sm:left-[20px] top-[-12px] sm:top-[unset] sm:bottom-[-11px] sm:rotate-180 drop-shadow-[rgb(51,_54,_57)_1px_-1px_1px]" />
                </Popover.Panel>
              </Popover>
            )}
          </div>
          <div className="flex-1 text-white flex justify-center">
            <TwitterLogo aria-label="Twitter logo" />
          </div>
          <div className="flex-1" />
        </div>
        {!user && (
          <div className="flex w-full gap-2">
            <ButtonOrLink
              stretch
              size="small"
              variant="primary"
              as="link"
              to="/signin"
            >
              Log in
            </ButtonOrLink>
            <ButtonOrLink
              stretch
              size="small"
              variant="secondary"
              as="link"
              to="/signup"
            >
              Sign up
            </ButtonOrLink>
          </div>
        )}
      </div>
      {user && (
        <div className="hidden sm:flex p-4 border-b border-solid border-gray-700">
          <img
            src={user.profileImage ?? DEFAULT_PROFILE_IMAGE}
            className="rounded-full object-contain max-h-[48px]"
            width={48}
            height={48}
            alt={`${user.username}'s avatar`}
          />
          <div className="flex-1 ml-3 mt-2">
            <Form ref={formRef} method="post" action="/resource/create-tweet">
              <textarea
                name="tweet"
                id="tweet"
                required
                maxLength={280}
                className="bg-transparent w-full text-white text-xl resize-none h-24 outline-none placeholder:text-gray-500"
                placeholder="What's happening?"
              />
              <div className="flex border-t border-solid border-gray-700 pt-3 justify-end w-full">
                <ButtonOrLink
                  variant="primary"
                  size="small"
                  type="submit"
                  disabled={navigation.state === "submitting"}
                >
                  Tweet
                </ButtonOrLink>
              </div>
            </Form>
          </div>
        </div>
      )}
      <SuspendedInfiniteTweets
        initialTweetsPromise={tweets}
        currentLoggedInUser={
          user
            ? {
                id: user.id,
                username: user.username,
                name: user.name ?? undefined,
                profileImage: user.profileImage,
              }
            : undefined
        }
        type="home_timeline"
      />
    </>
  );
}
