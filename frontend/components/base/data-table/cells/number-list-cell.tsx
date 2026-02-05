import React from 'react';

import EmptyCell from '@/components/base/data-table/cells/empty-cell';

import { Separator } from '../../shadcn/separator';

import NumberCell from './number-cell';

type NumberListCellProps = {
  values?: number[];
  fractionDigits?: number;
};

function NumberListCell({ values, fractionDigits = 2 }: NumberListCellProps) {
  if (!values || values.length === 0) return <EmptyCell />;

  return (
    <div className="flex items-center gap-2">
      {values.map((value, index) => (
        <React.Fragment key={index}>
          <NumberCell value={value} fractionDigits={fractionDigits} />
          {index < values.length - 1 && <Separator orientation="vertical" className="h-3" />}
        </React.Fragment>
      ))}
    </div>
  );
}

export default NumberListCell;
