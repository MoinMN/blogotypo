import "@styles/globals.css";
import AuthProvider from "@context/AuthProvider";
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from '@vercel/speed-insights/next';

export const metadata = {
  title: "Best Blogging Platform - Blogotypo",
  description: "Create, share, and explore blogs on Blogotypo. The best blogging platform for writers and readers.",
  keywords: "Blog, Blogging, Write, Share, Blogotypo",
  metadataBase: new URL("https://blogotypo.moinnaik.bio"),
  openGraph: {
    title: "Best Blogging Platform - Blogotypo",
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
    title: "Best Blogging Platform - Blogotypo",
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
          {children}
          <Analytics />
          <SpeedInsights />
        </AuthProvider>

        <script src="https://kit.fontawesome.com/93f8c5dee5.js" crossOrigin="anonymous"></script>
      </body>
    </html>
  );
}
