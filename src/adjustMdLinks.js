import { toString, trailingSlash } from "@weborigami/async-tree";

const specHref = `https://github.com/wgsl-tooling-wg/wesl-spec/blob/main/`;
const wikiHref = `https://github.com/wgsl-tooling-wg/wesl-spec/wiki/`;

/**
 * Adjust links in markdown to meet our needs
 *
 * The site is built from markdown documents written for the spec and wiki.
 * Links in those documents are (and should continue to be) written as relative
 * links so the links will work in those locations on GitHub.
 *
 * When we build the site, however, we need to adjust those links so that they
 * point to locations inside the site.
 *
 * We also need to change internal links to `.md` files to `.html` files, and
 * add a `.html` extension to internal links that don't have an extension.
 *
 * Finally, we want to be able to move a page to a different point in the site
 * hierarchy and adjust the base path for its links accordingly. This is needed,
 * for example, when we move the wiki Home page content to become the index page
 * at the top level of the site.
 *
 * @param {import("@weborigami/async-tree").StringLike} input
 * @param {string} [basePath]
 */
export default function adjustMdLinks(input, basePath = "") {
  const markdown = toString(input);
  // Matches markdown links of the form `[link](href)`
  const linkRegex = /\[(?<text>[^\]]+)\]\((?<href>[^)]+)\)/g;
  return markdown.replace(linkRegex, (match, text, href, offset) => {
    // Test to see if the link is internal or external
    const url = fakeUrl(href, match);
    const internal = url.protocol === "fake:";
    return internal
      ? adjustInternalLink(match, text, href, basePath)
      : adjustExternalLink(match, text, href);
  });
}

/** Create a url so we can test whether an href is relative or absolute */
function fakeUrl(href, link) {
  let url;
  try {
    url = new URL(href, "fake://");
  } catch (e) {
    throw new Error(`Invalid href: '${href}'  in link: '${link}'`);
  }
  return url;
}

function adjustExtension(href) {
  return href.replace(/\.md$/, ".html");
}

function adjustExternalLink(match, text, href) {
  let adjustedHref;
  if (href.startsWith(specHref)) {
    // External link to the spec; map to spec/ area
    adjustedHref = adjustExtension(href.replace(specHref, `/spec/`));
  } else if (href.startsWith(wikiHref)) {
    // External link to the wiki; map to docs/ area
    adjustedHref = adjustExtension(href.replace(wikiHref, `/docs/`));
  }
  return adjustedHref ? `[${text}](${adjustedHref})` : match;
}

function adjustInternalLink(match, text, href, basePath) {
  // Skip if the path ends in a slash or contains a `#` anchor
  if (href.endsWith("/") || href.includes("#")) {
    return match;
  }

  if (!href.match(/(\.[a-z]+)$/i)) {
    // No extension; append .html
    href += ".html";
  } else {
    href = adjustExtension(href);
  }

  if (basePath) {
    href = trailingSlash.add(basePath) + href;
  }

  return `[${text}](${href})`;
}
