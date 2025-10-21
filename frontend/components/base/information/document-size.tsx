import { filesize } from 'filesize';

import EmptyField from './empty-field';

export type DocumentSizeProps = {
  value?: number;
};

export function valueToFileSize(value: number) {
  return filesize(value, { standard: 'jedec' });
}

function DocumentSize({ value }: DocumentSizeProps) {
  if (!value) return <EmptyField />;

  return <div>{valueToFileSize(value)}</div>;
}
export default DocumentSize;
