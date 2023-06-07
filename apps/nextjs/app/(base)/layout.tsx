import { Home, Profile, TwitterLogo } from "ui/icons";
import { ButtonOrLink } from "components/ButtonOrLink";
import { getUserId, isAuthenticated, clearAuthCookie } from "utils/auth";
import { getUser } from "utils/user";
import { TweetButton } from "./TweetButtonWithModal";
import { ProfileButton } from "./ProfileButton";

const NavItem = ({
  children,
  icon,
  href,
}: {
  children: React.ReactNode;
  icon: React.ReactNode;
  href: string;
}) => (
  <a
    href={href}
    className="flex p-3 gap-5 items-center rounded-full text-xl text-white hover:bg-gray-100/10 w-fit pr-4"
  >
    {icon}
    {children}
  </a>
);

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

const ProfileButtonWrapper = async () => {
  const userId = getUserId();
  const user = await getUser(userId);

  const logOut = async () => {
    'use server';
    clearAuthCookie();
  }

  return <ProfileButton name={user.name ?? ''} username={user.username} logOut={logOut} />;
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isLoggedIn = isAuthenticated();
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
                <NavItem href="/" icon={<Home />}>
                  Home
                </NavItem>
                <NavItem href="/profile" icon={<Profile />}>
                  Profile
                </NavItem>
              </nav>
              <div className="w-[90%]">
                <TweetButton />
              </div>
            </div>
            {/* @ts-expect-error Async Server Component */}
            {isLoggedIn && <ProfileButtonWrapper />}
          </div>
        </header>
        <main className="flex-[8] w-full overflow-y-auto">{children}</main>
      </div>
      {!isLoggedIn && <LoggedOutFooter />}
    </>
  );
}
