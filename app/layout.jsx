import "@styles/globals.css";
import ReduxProvider from "@redux/provider";
import AuthProvider from "@context/AuthProvider";
import { UIProvider } from "@/context/UIContext";
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from '@vercel/speed-insights/next';
import ScrollToTop from "@components/ScrollToTop";
import Script from "next/script";
import GoogleOneTap from "@components/GoogleOneTap";
import { ThemeProvider } from "@context/ThemeContext";

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

export const metadata = {
  title: "Blogotypo - Free Blogging Platform for Writers and Readers",
  description:
    "Create, publish, and share blogs for free on Blogotypo. Explore technology, business, lifestyle, sports, education, and trending articles from writers worldwide.",
  keywords:
    "blogging platform, free blogging website, write blogs online, publish articles, blogotypo, content creators, writers community",
  manifest: "/manifest.json",
  metadataBase: new URL("https://blogotypo.moinnaik.in"),

  openGraph: {
    title: "Blogotypo - Free Blogging Platform for Writers and Readers",
    description:
      "Create, publish, and share blogs for free. Discover trending articles, expert insights, and stories across multiple categories on Blogotypo.",
    url: "https://blogotypo.moinnaik.in",
    siteName: "Blogotypo",
    images: [
      {
        url: "https://blogotypo.moinnaik.in/opengraph-image.jpg",
        secureUrl: "https://blogotypo.moinnaik.in/opengraph-image.jpg",
        width: 1200,
        height: 630,
        alt: "Blogotypo - Free Blogging Platform",
        type: "image/jpeg",
      },
    ],
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Blogotypo - Free Blogging Platform for Writers and Readers",
    description:
      "Create, publish, and share blogs for free. Explore articles, insights, and stories from creators around the world.",
    images: ["https://blogotypo.moinnaik.in/opengraph-image.jpg"],
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="monetag" content="aae9d184f9bfef3ade113f1d0fdab8c1">
        <script
          dangerouslySetInnerHTML={{
            __html: `
          (function() {
            const theme = localStorage.getItem('theme');
            if (theme === 'dark') {
              document.documentElement.classList.add('dark');
            } else {
              document.documentElement.classList.remove('dark');
            }
          })();
        `,
          }}
        />
      </head>
      <body className="bg-gray-50 dark:bg-[#0a0a14] text-black dark:text-gray-50 transition-colors duration-300 roboto_font" cz-shortcut-listen="true">

        <AuthProvider>
          <ReduxProvider>
            <ThemeProvider>
              <UIProvider>
                {children}
                <GoogleOneTap />
              </UIProvider>
            </ThemeProvider>
            <ScrollToTop />
            <Analytics />
            <SpeedInsights />
          </ReduxProvider>
        </AuthProvider>

        <Script
          src="https://accounts.google.com/gsi/client"
          strategy="afterInteractive"
        />
        <script src="https://kit.fontawesome.com/93f8c5dee5.js" crossOrigin="anonymous"></script>
      </body>
    </html>
  );
}
