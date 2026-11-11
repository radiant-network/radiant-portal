import EmptyCell from './empty-cell';

type TextCellProps = {
  children?: string;
  isNumber?: boolean;
};
function TextCell({ children, isNumber }: TextCellProps) {
  if (!children && !isNumber) return <EmptyCell />;
  if (isNumber && (children === undefined || children === null)) return <EmptyCell />;
  return <>{children}</>;
}
export default TextCell;
