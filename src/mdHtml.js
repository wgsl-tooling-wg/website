import { extension, isUnpackable, toString } from "@weborigami/async-tree";
import highlight from "highlight.js";
import { Marked } from "marked";
import markedFootnote from "marked-footnote";
import { gfmHeadingId as markedGfmHeadingId } from "marked-gfm-heading-id";
import { markedHighlight } from "marked-highlight";
import { markedSmartypants } from "marked-smartypants";

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
  markedFootnote(),
  {
    gfm: true,
  },
);

/**
 * Transform markdown to HTML, with footnote support.
 *
 * Wraps Origami's mdHtml with the marked-footnote extension.
 */
export default async function mdHtml(input) {
  if (input == null) {
    throw new TypeError("mdHtml: The input is not defined.");
  }
  if (isUnpackable(input)) {
    input = await input.unpack();
  }
  const inputIsDocument = typeof input === "object" && "_body" in input;
  const markdown = inputIsDocument ? input._body : toString(input);
  if (markdown === null) {
    throw new Error("mdHtml: The provided input couldn't be treated as text.");
  }
  const html = marked.parse(markdown);
  if (inputIsDocument) {
    return { ...input, _body: html };
  }
  return html;
}

mdHtml.key = (sourceValue, sourceKey) =>
  extension.replace(sourceKey, ".md", ".html");
mdHtml.inverseKey = (resultKey) =>
  extension.replace(resultKey, ".html", ".md");
