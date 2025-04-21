/**
 * Scans the HTML for header tags with `id` attributes and returns adjusted HTML
 * in which each header tag has a link to itself.
 *
 * @param {string} html
 */
export default function headerLinks(html) {
  const headerRegex =
    /(?<open><h([1-6])[^>]*id="(?<id>[^"]+)"[^>]*>)(?<children>.*?)(?<close><\/h\2>)/g;
  return html.replace(
    headerRegex,
    (match, open, level, id, children, close) => {
      const link = ` <a href="#${id}">#</a>`;
      return `${open}${children}${link}${close}`;
    }
  );
}
