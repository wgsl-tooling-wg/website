import { toString, trailingSlash } from "@weborigami/async-tree";

// Given markdown with relative links, change their base path
export default function adjustMdLinks(input, basePath) {
  const markdown = toString(input);
  // Matches links of the form `[text](href)`
  const linkRegex = /\[(?<text>[^\]]+)\]\((?<href>[^)]+)\)/g;
  return markdown.replace(linkRegex, (match, text, href) => {
    const url = new URL(href, "fake://");
    if (url.protocol === "fake:") {
      // Local path
      return `[${text}](${trailingSlash.remove(basePath)}/${href})`;
    } else {
      return match;
    }
  });
}
