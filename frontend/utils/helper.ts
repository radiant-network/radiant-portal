/**
 * Sanitize HTML to prevent XSS attacks
 * @param html - The HTML string to sanitize
 * @returns The sanitized HTML string
 */
export function sanitizeHtml(html: string): string {
  const div = document.createElement('div');
  div.innerHTML = html;

  const scripts = div.querySelectorAll('script');
  scripts.forEach(script => script.remove());

  const allElements = div.querySelectorAll('*');
  allElements.forEach(element => {
    const attrs = element.attributes;
    for (let i = attrs.length - 1; i >= 0; i--) {
      const attr = attrs[i];
      if (attr.name.startsWith('on')) {
        element.removeAttribute(attr.name);
      }
    }
  });

  return div.innerHTML;
}

/**
 * Decode HTML entities
 * @param html - The HTML string to decode
 * @returns The decoded HTML string
 */
export function decodeHtmlEntities(html: string): string {
  const textarea = document.createElement('textarea');
  textarea.innerHTML = html;
  return textarea.value;
}
