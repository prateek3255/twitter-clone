import "ui/global.css";
import localFont from "next/font/local";
import { Metadata } from "next";

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

export const metadata: Metadata = {
  title: "Home | Twitter Clone",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${chirp.variable} h-full`}>
      <body className="bg-black h-full overflow-hidden">{children}</body>
    </html>
  );
}
