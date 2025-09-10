import EmptyField from './empty-field';

type ConditionFieldProps = {
  condition: boolean;
  children?: any;
};
function ConditionalField({ condition, children }: ConditionFieldProps) {
  return condition ? <>{children}</> : <EmptyField />;
}
export default ConditionalField;
