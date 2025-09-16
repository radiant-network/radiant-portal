type RelationshipToProbandFieldProps = {
  relationship: string;
};
/**
 * Display RAW data
 * Must not be translated
 * @SEE: https://www.notion.so/ferlab/254b0fcecb3d80ada7aafa47c715b07c?v=254b0fcecb3d8106927b000cc6a71e78
 */
function RelationshipToProbandField({ relationship }: RelationshipToProbandFieldProps) {
  return <span className="capitalize">{relationship}</span>;
}
export default RelationshipToProbandField;
