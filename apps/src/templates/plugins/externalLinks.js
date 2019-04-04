/**
 * Open external links in a new tab.
 */
export default function externalLinks() {
  const Parser = this.Parser;
  const tokenizers = Parser.prototype.inlineTokenizers;
  const original = tokenizers.link;
  tokenizers.link = function(eat, value, silent) {
    const link = original.call(this, eat, value, silent);
    if (link && link.type === 'link' && isExternalLink(link.url)) {
      link.data = link.data || {};
      link.data.hProperties = link.data.hProperties || {};

      const props = link.data.hProperties;
      props.target = props.target || '_blank';
      props.rel = 'noreferrer noopener';
    }

    return link;
  };
  tokenizers.link.locator = original.locator;
}

export function isExternalLink(url) {
  const hostname = new URL(url, 'https://code.org').hostname;
  return !/(^|\.)code\.org$/.test(hostname);
}
