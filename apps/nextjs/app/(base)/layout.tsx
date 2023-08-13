import {
  Home,
  HomeFilled,
  Profile,
  ProfileFilled,
  TwitterLogo,
} from "ui/icons";
import { ButtonOrLink } from "components/ButtonOrLink";
import { clearAuthCookie } from "utils/auth";
import { getCurrentLoggedInUser } from "utils/user";
import { DEFAULT_PROFILE_IMAGE } from "constants/user";
import { TweetButton } from "./components/TweetButtonWithModal";
import { ProfileButton } from "./components/ProfileButton";
import { NavItem } from "./components/NavItem";

const LoggedOutFooter = () => (
  <div className="fixed flex bottom-0 left-0 right-0 h-[4.5rem] bg-primary-blue">
    <div className="flex-[4]" />
    <div className="flex-[8] py-3">
      <div className="w-[850px] flex justify-between">
        <div className="flex flex-col">
          <span className="text-white text-2xl font-bold">
            Don’t miss what’s happening
          </span>
          <span className="text-white text-sm">
            People on Twitter are the first to know.
          </span>
        </div>
        <div className="flex items-center gap-3">
          <ButtonOrLink as="link" href="/signin" variant="tertiary-light">
            Log in
          </ButtonOrLink>
          <ButtonOrLink as="link" href="/signup" variant="secondary">
            Sign up
          </ButtonOrLink>
        </div>
      </div>
    </div>
  </div>
);

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentLoggedInUser();
  const isLoggedIn = !!user;

  return (
    <>
      <div className="flex w-full h-full">
        <header className="w-full h-full flex-[4] flex flex-col items-end text-white pb-3 pt-2 px-2 border-r border-solid border-gray-700">
          <div className="w-full max-w-[256px] h-full flex flex-col justify-between">
            <div>
              <h1>
                <a
                  href="/"
                  className=" h-[50px] w-[50px] rounded-full flex justify-center items-center hover:bg-gray-100/10"
                >
                  <TwitterLogo aria-label="Twitter logo" />
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
        <main className="flex-[8] w-full overflow-y-auto">
          <div className="w-full min-h-full max-w-[600px] border-r border-solid border-gray-700">
            {children}
          </div>
        </main>
      </div>
      {!isLoggedIn && <LoggedOutFooter />}
    </>
  );
}
