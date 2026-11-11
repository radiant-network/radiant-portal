// Recursively copy computed styles from the rendered SVG onto the clone so
// that CSS-driven fills/strokes (e.g. Tailwind classes) survive serialization
// into a standalone SVG.
function inlineComputedStyles(source: Element, target: Element) {
  const computed = window.getComputedStyle(source);
  const targetStyle = (target as HTMLElement | SVGElement).style;
  for (const property of computed) {
    targetStyle.setProperty(property, computed.getPropertyValue(property));
  }
  for (let i = 0; i < source.children.length; i++) {
    inlineComputedStyles(source.children[i], target.children[i]);
  }
}

/**
 * Render an SVG element to a PNG and trigger its download.
 *
 * Renders at the SVG's viewBox size so the export is independent of the
 * responsive on-screen size, and draws with explicit dimensions so the result is
 * complete across browsers
 */
export function downloadSvgAsPng(svg: SVGSVGElement, fileName: string, background = 'white') {
  const [, , vbWidth, vbHeight] = (svg.getAttribute('viewBox') ?? '').split(' ').map(Number);
  const clone = svg.cloneNode(true) as SVGSVGElement;
  inlineComputedStyles(svg, clone);
  clone.setAttribute('width', String(vbWidth));
  clone.setAttribute('height', String(vbHeight));

  const svgData = new XMLSerializer().serializeToString(clone);
  const img = new Image();
  img.onload = () => {
    const canvas = document.createElement('canvas');
    canvas.width = vbWidth;
    canvas.height = vbHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, vbWidth, vbHeight);
    ctx.drawImage(img, 0, 0, vbWidth, vbHeight);

    const a = document.createElement('a');
    a.download = `${fileName}.png`;
    a.href = canvas.toDataURL('image/png', 1);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };
  img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgData);
}
