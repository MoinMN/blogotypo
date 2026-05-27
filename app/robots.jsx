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
          "/docs/faq",
          "/docs/license",
          "/docs/privacy-policy",
          "/docs/term-and-conditions",
          "/api/blog/",
          "/api/auth/session",
        ],
        disallow: [
          "/admin/",
          "/login",
          "/register",
          "/profile",
          "/my-blogs",
          "/api/auth/",
        ],
      },
    ],
    sitemap: "https://blogotypo.moinnaik.in/sitemap.xml",
  };
}
