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
    className="flex p-3 gap-5 items-center rounded-full text-xl text-white hover:bg-gray-100/10"
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
    <html lang="en" className={`${chirp.variable}`}>
      <body className="bg-black">
        <div className="flex w-full">
          <header className="w-full items-end text-white">
            <h1>
              <TwitterLogo />
            </h1>
            <nav>
              <NavItem href="/" icon={<Home />}>
                Home
              </NavItem>
              <NavItem href="/profile" icon={<Profile />}>
                Profile
              </NavItem>
            </nav>
            <Button variant="primary">Tweet</Button>
            <button className="flex justify-between w-64 items-center p-3 rounded-full hover:bg-gray-100/10">
              <div className="flex gap-3 items-center">
                <Image
                  src="https://pbs.twimg.com/profile_images/1608754757967183872/GJO7c_03_x96.jpg"
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
          </header>
          <main className="flex-1">{children}</main>
        </div>
      </body>
    </html>
  );
}
