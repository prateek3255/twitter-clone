import type { LinksFunction, ActionArgs } from "@remix-run/node";
import { TwitterLogo } from "ui";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import { ButtonOrLink } from "~/components/ButtonOrLink";
import { destroyUserSession } from "~/utils/auth.server";

import styles from "./styles/app.css";

export const links: LinksFunction = () => [{ rel: "stylesheet", href: styles }];

const fonts = `
  @font-face {
  font-family: 'chirp';
  src: url(/fonts/Chirp-Bold.woff2) format('woff2');
  font-display: swap;
  font-weight: 700;
  }
  
  @font-face {
  font-family: 'chirp';
  src: url(/fonts/Chirp-Regular.woff2) format('woff2');
  font-display: swap;
  font-weight: 400;
  }
  
  @font-face {
  font-family: 'chirp';
  src: url(/fonts/Chirp-Heavy.woff2) format('woff2');
  font-display: swap;
  font-weight: 900;
  }

  :root {
    --font-chirp: 'chirp', system-ui, sans-serif;
  }
`;

export const action = async ({ request }: ActionArgs) => {
  const form = await request.formData();
  const action = form.get("_action")?.toString() ?? "";

  if (action === "logout") {
    return destroyUserSession(request);
  }
};

const Document = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en" className="h-full">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <style
          dangerouslySetInnerHTML={{
            __html: fonts,
          }}
        />
        <Meta />
        <Links />
      </head>
      <body className="font-sans bg-black h-full overflow-hidden">
        {children}
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
};

export default function App() {
  return (
    <Document>
      <Outlet />
    </Document>
  );
}

export const ErrorBoundary = () => {
  return (
    <Document>
      <main className="flex h-full w-full justify-center items-center">
        <div className="max-w-md w-full border border-solid border-gray-400 rounded-xl px-10 pt-5 pb-8">
          <div className="w-100 flex justify-center mb-4 text-white">
            <TwitterLogo aria-label="Twitter logo" />
          </div>
          <div className="flex flex-col gap-8 items-center">
            <h1 className="font-bold text-3xl text-white">
              Something went wrong!
            </h1>
            <form method="post" className="w-full">
              <ButtonOrLink
                size="large"
                stretch
                name="_action"
                value="logout"
                type="submit"
              >
                Try again
              </ButtonOrLink>
            </form>
          </div>
        </div>
      </main>
    </Document>
  );
};
