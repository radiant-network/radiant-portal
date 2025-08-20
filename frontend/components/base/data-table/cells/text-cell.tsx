import EmptyCell from './empty-cell';

type TextCellProps = {
  children?: string;
};
function TextCell({ children }: TextCellProps) {
  if (!children) return <EmptyCell />;
  return <>{children}</>;
}
export default TextCell;
