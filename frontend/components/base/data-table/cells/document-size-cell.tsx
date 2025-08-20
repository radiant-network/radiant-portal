import DocumentSize, { DocumentSizeProps } from '../../information/document-size';

import EmptyCell from './empty-cell';

function DocumentSizeCell({ value, ...props }: DocumentSizeProps) {
  if (!value) return <EmptyCell />;

  return <DocumentSize value={value} {...props} />;
}
export default DocumentSizeCell;
