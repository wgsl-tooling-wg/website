import { extension, isUnpackable } from "@weborigami/async-tree";
import { documentObject, toString } from "@weborigami/origami";
import highlight from "highlight.js";
import { Marked } from "marked";
import { gfmHeadingId as markedGfmHeadingId } from "marked-gfm-heading-id";
import { markedHighlight } from "marked-highlight";
import { markedSmartypants } from "marked-smartypants";

const specHref = `https://github.com/wgsl-tooling-wg/wesl-spec/blob/main/`;
const wikiHref = `https://github.com/wgsl-tooling-wg/wesl-spec/wiki/`;

const renderer = {
  // Custom link renderer to transform links that need to work on the public
  // spec or wiki into links that will work inside the website
  link({ href, title, text }) {
    // extension.
    const url = new URL(href, "fake://");
    if (url.protocol === "fake:") {
      // Local path

      // Skip if the path ends in a slash or contains a `#` anchor
      if (!(href.endsWith("/") || href.includes("#"))) {
        if (!href.match(/(\.[a-z]+)$/i)) {
          // No extension; append .html
          href += ".html";
        } else if (href.endsWith(".md")) {
          // Change .md to .html
          href = href.replace(/\.md$/, ".html");
        }
      }
    } else if (href.startsWith(specHref)) {
      // External link to the spec; map to spec/ area
      href = href.replace(specHref, `/spec/`);
      href = href.replace(/\.md$/, ".html");
    } else if (href.startsWith(wikiHref)) {
      // External link to the wiki; map to docs/ area
      href = href.replace(wikiHref, `/docs/`);
      href = href.replace(/\.md$/, ".html");
    }

    const titleAttr = title ? ` title="${title}"` : "";
    return `<a href="${href}"${titleAttr}>${text}</a>`;
  },
};

const marked = new Marked();
marked.use(
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
    renderer,
  }
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
  const html = marked.parse(markdown);
  return inputIsDocument ? documentObject(html, input) : html;
}

mdHtml.key = (sourceKey) => extension.replace(sourceKey, ".md", ".html");
mdHtml.inverseKey = (resultKey) => extension.replace(resultKey, ".html", ".md");
