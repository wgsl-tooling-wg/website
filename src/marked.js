import { isUnpackable } from "@weborigami/async-tree";
import { documentObject, toString } from "@weborigami/origami";
import highlight from "highlight.js";
import { marked } from "marked";
import { gfmHeadingId as markedGfmHeadingId } from "marked-gfm-heading-id";
import { markedHighlight } from "marked-highlight";
import { markedSmartypants } from "marked-smartypants";

const renderer = {
  link({ href, title, text }) {
    // Append '.html' if the link is a local path and does not have an
    // extension. Don't do that if the href ends with a slash.
    const url = new URL(href, "fake://");
    if (url.protocol === "fake:") {
      // Local path
      if (!href.match(/\/|(\.[a-z]+)$/i)) {
        href += ".html";
      }
    }

    const titleAttr = title ? ` title="${title}"` : "";
    return `<a href="${href}"${titleAttr}>${text}</a>`;
  },
};

marked.use(
  // @ts-ignore
  markedGfmHeadingId(),
  markedHighlight({
    highlight(code, lang) {
      const language = highlight.getLanguage(lang) ? lang : "plaintext";
      return highlight.highlight(code, { language }).value;
    },

    langPrefix: "hljs language-",
  }),
  markedSmartypants(),
  {
    gfm: true, // Use GitHub-flavored markdown.
    // @ts-ignore
    mangle: false,
  },
  { renderer }
);

/**
 * Transform markdown to HTML.
 *
 * @typedef {import("@weborigami/async-tree").StringLike} StringLike
 * @typedef {import("@weborigami/async-tree").Unpackable<StringLike>} UnpackableStringlike
 *
 * @this {import("@weborigami/types").AsyncTree|null|void}
 * @param {StringLike|UnpackableStringlike} input
 */
export default async function mdHtml(input) {
  if (input == null) {
    const error = new TypeError("mdHtml: The input is not defined.");
    /** @type {any} */ (error).position = 0;
    throw error;
  }
  if (isUnpackable(input)) {
    input = await input.unpack();
  }
  const inputIsDocument = input["@text"] !== undefined;
  const markdown = toString(input);
  if (markdown === null) {
    throw new Error("mdHtml: The provided input couldn't be treated as text.");
  }
  const html = marked(markdown);
  return inputIsDocument ? documentObject(html, input) : html;
}
