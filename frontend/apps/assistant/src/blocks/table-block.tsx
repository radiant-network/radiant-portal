import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/base/shadcn/table';

import { type TableBlock as TableBlockData } from '../types';

/** Renders a table block with the simple shadcn Table (scrolls horizontally if wide). */
export function TableBlock({ block }: { block: TableBlockData }) {
  return (
    <div className="w-full">
      {block.title && <p className="mb-1.5 text-xs font-medium text-muted-foreground">{block.title}</p>}
      <Table className="w-max table-auto">
        <TableHeader>
          <TableRow>
            {block.columns.map(column => (
              <TableHead key={column.key} className="whitespace-nowrap">
                {column.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {block.rows.map((row, index) => (
            <TableRow key={index}>
              {block.columns.map(column => (
                <TableCell key={column.key} className="whitespace-nowrap">
                  {row[column.key]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
