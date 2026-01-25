import "@styles/globals.css";
import ReduxProvider from "@redux/provider";
import AuthProvider from "@context/AuthProvider";
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from '@vercel/speed-insights/next';
import ScrollToTop from "@components/ScrollToTop";

export const viewport = {
  themeColor: "#7c3aed",
};

export const metadata = {
  title: "Blogotypo - Best Blogging Platform",
  description: "Create, share, and explore blogs on Blogotypo. The best blogging platform for writers and readers.",
  keywords: "Blog, Blogging, Write, Share, Blogotypo",
  manifest: "/manifest.json",
  metadataBase: new URL("https://blogotypo.moinnaik.bio"),
  openGraph: {
    title: "Blogotypo - Best Blogging Platform",
    description: "Create, share, and explore blogs on Blogotypo.",
    url: "https://blogotypo.moinnaik.bio",
    siteName: "Blogotypo",
    images: [
      {
        url: "https://blogotypo.moinnaik.bio/opengraph-image.jpg",
        width: 1200,
        height: 630,
        alt: "Blogotypo Open Graph Image",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blogotypo - Best Blogging Platform",
    description: "Create, share, and explore blogs on Blogotypo.",
    images: ["https://blogotypo.moinnaik.bio/opengraph-image.jpg"],
  },
  robots: "index, follow",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="roboto_font bg-theme_1" cz-shortcut-listen="true">

        <AuthProvider>
          <ReduxProvider>
            {children}
            <ScrollToTop />
            <Analytics />
            <SpeedInsights />
          </ReduxProvider>
        </AuthProvider>

        <script src="https://kit.fontawesome.com/93f8c5dee5.js" crossOrigin="anonymous"></script>
      </body>
    </html>
  );
}
