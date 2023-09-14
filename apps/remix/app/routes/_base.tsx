import React from "react";
import { Outlet, Link, useLoaderData } from "@remix-run/react";
import {
  Home,
  HomeFilled,
  Profile,
  ProfileFilled,
  TwitterLogo,
  ThreeDots,
  ChevronDown,
  CreateTweetMobile,
} from "ui";
import { Popover } from "@headlessui/react";
import { ButtonOrLink } from "~/components/ButtonOrLink";
import { DialogWithClose } from "~/components/DialogWithClose";
import { getCurrentLoggedInUser } from "~/utils/user.server";
import { DEFAULT_PROFILE_IMAGE } from "~/constants/user";
import { type LoaderArgs, json } from "@remix-run/node";

export const loader = async ({ request }: LoaderArgs) => {
  const currentLoggedInUser = await getCurrentLoggedInUser(request);
  // TODO: Handle error handling
  //   if (isLoggedIn) {
  //     throw redirect("/", 302);
  //   }
  return json({ user: currentLoggedInUser }, { status: 200 });
};

const TweetButton = ({
  profileImage,
  loggedInUserName,
}: {
  profileImage: string;
  loggedInUserName: string;
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
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
        <form>
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
            <ButtonOrLink variant="primary" size="small" type="submit">
              Tweet
            </ButtonOrLink>
          </div>
        </form>
      </DialogWithClose>
    </>
  );
};

const NavItem = ({
  children,
  icon,
  href,
  activeIcon,
}: {
  children?: React.ReactNode;
  icon: React.ReactNode;
  activeIcon: React.ReactNode;
  href: string;
}) => {
  const isActive = false;
  return (
    <Link
      to={href}
      className={`flex p-3 gap-5 items-center rounded-full text-xl text-white hover:bg-gray-100/10 w-fit px-4 sm:px-3 sm:pr-5 ${
        isActive ? "font-bold" : ""
      }`}
    >
      {isActive ? activeIcon : icon}
      {children}
    </Link>
  );
};

const LoggedOutFooter = () => (
  <div className="fixed hidden px-4 sm:flex bottom-0 left-0 right-0 h-[4.5rem] bg-primary-blue">
    <div className="md:flex-[4]" />
    <div className="md:flex-[8] w-full py-3">
      <div className="max-w-[850px] w-full flex justify-between">
        <div className="flex flex-col">
          <span className="text-white text-2xl font-bold">
            Don’t miss what’s happening
          </span>
          <span className="text-white text-sm">
            People on Twitter are the first to know.
          </span>
        </div>
        <div className="flex items-center gap-3">
          <ButtonOrLink as="link" to="/signin" variant="tertiary-light">
            Log in
          </ButtonOrLink>
          <ButtonOrLink as="link" to="/signup" variant="secondary">
            Sign up
          </ButtonOrLink>
        </div>
      </div>
    </div>
  </div>
);

const ProfileButton = ({
  name,
  username,
  profileImage,
}: {
  name: string;
  username: string;
  profileImage: string;
}) => {
  return (
    <Popover className="relative">
      <Popover.Button className="flex justify-between sm:w-full items-center sm:p-3 rounded-full hover:bg-gray-100/10">
        <div className="flex gap-3 items-center">
          <img
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
          // onClick={() => {
          //   startTransition(async () => {
          //     await logout();
          //   });
          // }}
        >
          Log out @{username}
        </button>
        <ChevronDown className="text-black absolute left-[12px] sm:left-[20px] top-[-12px] sm:top-[unset] sm:bottom-[-11px] sm:rotate-180 drop-shadow-[rgb(51,_54,_57)_1px_-1px_1px]" />
      </Popover.Panel>
    </Popover>
  );
};

export default function RootLayout() {
  const { user } = useLoaderData<typeof loader>();
  const isLoggedIn = !!user;

  return (
    <>
      <div className="w-full min-h-full block sm:grid sm:grid-cols-[4fr_8fr]">
        {/* Desktop Sidebar */}
        <header className="hidden sm:flex w-full h-full flex-col items-end text-white pb-3 pt-2 px-2 border-r border-solid border-gray-700">
          <div className="w-full max-w-[256px] h-full flex flex-col justify-between">
            <div>
              <h1>
                <a
                  href="/"
                  className=" h-[50px] w-[50px] rounded-full flex justify-center items-center hover:bg-gray-100/10"
                >
                  <TwitterLogo aria-label="Twitter logo" />
                  <span className="sr-only">Go to home</span>
                </a>
              </h1>
              <nav className="mt-1">
                <NavItem href="/" icon={<Home />} activeIcon={<HomeFilled />}>
                  Home
                </NavItem>
                {isLoggedIn && (
                  <NavItem
                    href={`/${user.username}`}
                    icon={<Profile />}
                    activeIcon={<ProfileFilled />}
                  >
                    Profile
                  </NavItem>
                )}
              </nav>
              <div className="w-[90%]">
                {isLoggedIn && (
                  <TweetButton
                    profileImage={user.profileImage ?? DEFAULT_PROFILE_IMAGE}
                    loggedInUserName={user.name ?? user.username}
                  />
                )}
              </div>
            </div>
            {isLoggedIn && (
              <ProfileButton
                name={user.name ?? ""}
                username={user.username}
                profileImage={user.profileImage ?? DEFAULT_PROFILE_IMAGE}
              />
            )}
          </div>
        </header>
        {/* Mobile Bottom Navbar */}
        {isLoggedIn && (
          <>
            <div className="block sm:hidden fixed right-4 z-10 bottom-[4.5rem]">
              <TweetButton
                profileImage={user.profileImage ?? DEFAULT_PROFILE_IMAGE}
                loggedInUserName={user.name ?? user.username}
              />
            </div>
            <nav className=" z-10 flex sm:hidden fixed left-0 bottom-0 right-0 h-[3.5rem] justify-around border-t border-solid border-gray-700 bg-black">
              <NavItem href="/" icon={<Home />} activeIcon={<HomeFilled />} />
              <NavItem
                href={`/${user.username}`}
                icon={<Profile />}
                activeIcon={<ProfileFilled />}
              />
            </nav>
          </>
        )}
        {/* Main Content */}
        <main className="flex-[8] w-full overflow-y-auto max-h-screen">
          <div className="w-full min-h-full max-w-[600px] border-r border-solid border-gray-700">
            <Outlet />
          </div>
        </main>
      </div>
      {!isLoggedIn && <LoggedOutFooter />}
    </>
  );
}
