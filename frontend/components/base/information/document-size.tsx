import { filesize } from 'filesize';

import EmptyField from './empty-field';

export type DocumentSizeProps = {
  value?: number;
};

function DocumentSize({ value }: DocumentSizeProps) {
  if (!value) return <EmptyField />;

  return <div>{filesize(value, { standard: 'jedec' })}</div>;
}
export default DocumentSize;
