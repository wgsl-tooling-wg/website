import { toString } from "@weborigami/async-tree";

/**
 * Post-process HTML output from the markdown converter.
 *
 * Strip <p> / </p> tags that the CommonMark parser injects inside <script>
 * blocks and around web component elements. Blank lines in shader code end
 * the type-6 HTML block, so subsequent lines get wrapped in paragraphs.
 */
export default function fixHtmlOutput(input) {
  let html = toString(input);

  // Remove <p> and </p> tags from inside <script> elements
  html = html.replace(
    /(<script\b[^>]*>)([\s\S]*?)(<\/script>)/gi,
    (_, open, body, close) => open + body.replace(/<\/?p>/g, "") + close
  );

  // Remove <p> and </p> tags wrapping web component elements
  html = html.replace(/<p>(<wgsl-(?:edit|play)\b)/g, "$1");
  html = html.replace(/(<\/wgsl-(?:edit|play)>)<\/p>/g, "$1");

  return html;
}
