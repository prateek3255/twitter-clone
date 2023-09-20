import type { LinksFunction, ActionFunctionArgs } from "@remix-run/node";
import { TwitterLogo } from "ui";
import {
  Form,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useRouteError,
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

export const action = async ({ request }: ActionFunctionArgs) => {
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
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/icons/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/icons/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/icons/favicon-16x16.png"
        />
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
  const error = useRouteError();

  if (isRouteErrorResponse(error) && error.status === 404) {
    return (
      <Document>
        <main className="flex h-full w-full justify-center items-center">
          <div className="max-w-md w-full border border-solid border-gray-400 rounded-xl px-10 pt-5 pb-8">
            <div className="w-100 flex justify-center mb-4 text-white">
              <TwitterLogo aria-label="Twitter logo" />
            </div>
            <div className="flex flex-col gap-8 items-center">
              <h1 className="font-bold text-2xl text-white">
                Hmm...this page doesn’t exist. Try searching for something else.
              </h1>
              <ButtonOrLink size="large" className="w-full" as="link" to="/">
                Go to home
              </ButtonOrLink>
            </div>
          </div>
        </main>
      </Document>
    );
  }

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
            <Form method="post" className="w-full">
              <ButtonOrLink
                size="large"
                stretch
                name="_action"
                value="logout"
                type="submit"
              >
                Try again
              </ButtonOrLink>
            </Form>
          </div>
        </div>
      </main>
    </Document>
  );
};
