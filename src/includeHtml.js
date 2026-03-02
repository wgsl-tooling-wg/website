import { toString } from "@weborigami/async-tree";

export default function includeHtml(html, includeContent) {
  return toString(html).replace(
    /<!-- include \S+ -->/,
    toString(includeContent)
  );
}
