import "./global.css";
import localFont from "next/font/local";
import { Home, Profile, TwitterLogo } from "ui/icons";
import { Button } from "ui";

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
          </header>
          <main className="flex-1">{children}</main>
        </div>
      </body>
    </html>
  );
}
