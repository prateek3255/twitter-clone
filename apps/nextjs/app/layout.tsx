import "./global.css";
import localFont from "next/font/local";

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
  variable: '--font-chirp',
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${chirp.variable}`}>
      <body className="bg-black">
        <div className="flex w-full">
          <header className="flex w-full items-end">
            <nav className="flex flex-col w-[275px] text-white text-base">
              <a href="/">Home</a>
            </nav>
          </header>
          <main className="flex-1">{children}</main>
        </div>
      </body>
    </html>
  );
}
