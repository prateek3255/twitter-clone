import type { LinksFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";

import styles from './styles/app.css';

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: styles }
];

export default function App() {
  return (
    <html lang="en" className="h-full">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <style dangerouslySetInnerHTML={{
          __html: `
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
          `
        }} />
        <Meta />
        <Links />
      </head>
      <body className="font-sans bg-black h-full overflow-hidden">
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
