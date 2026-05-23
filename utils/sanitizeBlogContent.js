import sanitizeHtml from "sanitize-html";

export function sanitizeBlogContent(html) {
  return sanitizeHtml(html, {
    allowedTags: [
      "p",
      "b",
      "i",
      "em",
      "strong",
      "a",
      "ul",
      "ol",
      "li",
      "blockquote",
      "code",
      "pre",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "img",
      "br"
    ],

    allowedAttributes: {
      a: ["href", "target", "rel"],
      img: ["src", "alt"]
    },

    allowedSchemes: ["http", "https", "mailto"],

    allowedStyles: {}, // 🔥 Removes inline styles completely

    transformTags: {
      a: sanitizeHtml.simpleTransform("a", {
        rel: "noopener noreferrer",
        target: "_blank"
      })
    },

    disallowedTagsMode: "discard"
  });
}