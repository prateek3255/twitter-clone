import "./global.css";
import localFont from "next/font/local";
import { Home, Profile, ThreeDots, TwitterLogo } from "ui/icons";
import { Button } from "ui";
import Image from "next/image";

const chirp = localFont({
  src: [
    {
      path: "./fonts/Chirp-Bold.woff2",
      weight: "700",
    },
    {
      path: "./fonts/Chirp-Regular.woff2",
      weight: "400",
    },
    {
      path: "./fonts/Chirp-Heavy.woff2",
      weight: "900",
    },
  ],
  variable: "--font-chirp",
  display: "swap",
});

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${chirp.variable} h-full`}>
      <body className="bg-black h-full">
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
                <div className=" w-[90%]">
                <Button className="mt-3 w-full" variant="primary">
                  Tweet
                </Button>
                </div>
              </div>
              <button className="flex justify-between w-full items-center p-3 rounded-full hover:bg-gray-100/10">
                <div className="flex gap-3 items-center">
                  <Image
                    src="https://pbs.twimg.com/profile_images/1608754757967183872/GJO7c_03_400x400.jpg"
                    className="rounded-full object-contain max-h-[40px]"
                    width={40}
                    height={40}
                    alt="Prateek's profile image"
                  />
                  <div className="flex flex-col items-start text-white">
                    <span className="font-semibold text-base">
                      Prateek Surana
                    </span>
                    <span className="text-gray-500 text-sm">@psuranas</span>
                  </div>
                </div>
                <div className=" text-white">
                  <ThreeDots />
                </div>
              </button>
            </div>
          </header>
          <main className="flex-[8] w-full overflow-y-auto">{children}</main>
        </div>
      </body>
    </html>
  );
}
