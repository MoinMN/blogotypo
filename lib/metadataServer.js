const baseMetadata = {
  metadataBase: new URL("https://blogotypo.moinnaik.in"),
  keywords: "Blog, Blogging, Write, Share, Blogotypo",
  manifest: "/manifest.json",
  openGraph: {
    siteName: "Blogotypo",
    images: [
      {
        url: "https://blogotypo.moinnaik.in/opengraph-image.jpg",
        width: 1200,
        height: 630,
        alt: "Blogotypo Open Graph Image",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://blogotypo.moinnaik.in/opengraph-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export function createMetadata({
  title,
  description,
  slug,
  image,
  type = "website",
  robots,
}) {
  const url = slug
    ? `https://blogotypo.moinnaik.in${slug}`
    : "https://blogotypo.moinnaik.in";

  const ogImage =
    image || "https://blogotypo.moinnaik.in/opengraph-image.jpg";

  return {
    ...baseMetadata,

    title,
    description,

    openGraph: {
      ...baseMetadata.openGraph,
      title,
      description,
      url,
      type,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },

    twitter: {
      ...baseMetadata.twitter,
      title,
      description,
      images: [ogImage],
    },

    robots: robots || baseMetadata.robots,
  };
}