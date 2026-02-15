export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/blog/",
          "/blog/category",
          "/blog/search",
          "/contact",
          "/dashboard",
          "/publish-blog",
          "/docs/faq",
          "/docs/license",
          "/docs/privacy-policy",
          "/docs/term-and-conditions",
        ],
        disallow: [
          "/admin/",
          "/api/",
          "/login",
          "/register",
          "/profile",
          "/my-blogs",
        ],
      },
    ],
    sitemap: "https://blogotypo.moinnaik.in/sitemap.xml",
  };
}
