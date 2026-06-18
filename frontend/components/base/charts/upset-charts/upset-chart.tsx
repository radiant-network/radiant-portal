import { useEffect, useMemo, useRef, useState } from 'react';
import { asSets, ISetLike, UpSetJS } from '@upsetjs/react';
import { throttle } from 'lodash';
import { v4 } from 'uuid';

import { UpsetChartProps } from '../type';

import './upset-chart.css';

/**
 * React's useId can create broken querySelector, that why we use uuid v4 instead.
 * attributesSanitizer: e.g. remove phenotype (HP:XXXXXXX) code from data-text attributes
 */
function UpsetChart({ data, setName, combinationName, attributesSanitizer, onClick }: UpsetChartProps) {
  const gridRef = useRef<any>(null);
  const [width, setWidth] = useState<number>(400);
  const [height, setHeight] = useState<number>(300);
  const [selection, setSelection] = useState<ISetLike<unknown> | null>(null);

  const id = useMemo(() => v4(), [v4]);
  const sets = useMemo(() => asSets(data), [data]);

  /**
   * Resize and set ellipsis for all texts
   */
  const throttleComputeUpsetTextSize = useMemo(
    () =>
      throttle(function () {
        const csNode = document.querySelector(`#upset-${id} [data-upset="cs"]`);
        if (!csNode) return;
        const interactiveNodes = document.querySelectorAll(
          `#upset-${id} g[data-upset="sets"] g[class^="interactive-upset"]`,
        );
        interactiveNodes.forEach((node: any) => {
          const nameNode = node.querySelector('text[class^="setTextStyle-upset"]');
          if (!nameNode) return;

          const csNodeTransform = csNode.getAttribute('transform');
          if (!csNodeTransform) return;

          const match = csNodeTransform.match(/translate\(([^,]+),/);
          if (!match) return;

          // compute ellipsis size with font
          nameNode.textContent = '…';
          const ellipsisWidth = nameNode.getBBox().width;

          // compute text available space
          const csNodeX = parseFloat(match[1]);
          const nameNodeX = parseFloat(nameNode.getAttribute('x'));
          const availableDisplayWidth = Math.floor(csNodeX - nameNodeX - ellipsisWidth);
          const text = nameNode.getAttribute('data-text');
          nameNode.textContent = '';
          let isOverlapping = false;
          for (let i = 0; i < text.length; i++) {
            nameNode.textContent = text.substring(0, i);
            if (nameNode.getBBox().width > availableDisplayWidth) {
              nameNode.textContent = text.substring(0, i - 1) + '…';
              isOverlapping = true;
              break;
            }
          }

          if (!isOverlapping) {
            nameNode.textContent = text;
          }
        });
      }, 250),
    [],
  );

  useEffect(() => {
    const textElements = document.querySelectorAll(`#upset-${id} text[class^="setTextStyle-upset"]`);
    if (attributesSanitizer) {
      textElements.forEach((element: any) => {
        if (!element.getAttribute('data-text')) {
          element.setAttribute('data-text', element.textContent.replace(attributesSanitizer, ''));
        }
      });
    }

    throttleComputeUpsetTextSize();

    const gridObserver = new ResizeObserver(entries => {
      setWidth(entries[0].contentRect.width);
      setHeight(entries[0].contentRect.height);
      throttleComputeUpsetTextSize();
    });
    gridObserver.observe(gridRef.current);

    return () => {
      gridObserver.disconnect();
      throttleComputeUpsetTextSize.cancel();
    };
  }, [data, id, throttleComputeUpsetTextSize, attributesSanitizer]);

  return (
    <div id={`upset-${id}`} ref={gridRef}>
      {/* @ts-expect-error UpSetJS cannot be used as a JSX component (React 19 type mismatch) */}
      <UpSetJS
        setLabelAlignment={'left'}
        sets={sets}
        setName={setName}
        combinationName={combinationName}
        exportButtons={false}
        selection={selection}
        combinations={{
          min: 2,
          limit: 25,
          type: 'distinctIntersection',
        }}
        widthRatios={[0.15, 0.2]}
        heightRatios={[0.55]}
        emptySelection={false}
        width={width}
        height={height}
        onHover={s => setSelection(s)}
        onClick={(s: any) => {
          const values: string[] = [];
          if (s.sets) {
            s.sets.forEach((set: any) => {
              values.push(set.name);
            });
          } else {
            values.push(s.name);
          }

          onClick?.(values);
        }}
      />
    </div>
  );
}
export default UpsetChart;
