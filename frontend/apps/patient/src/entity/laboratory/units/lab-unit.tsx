const UNIT_DISPLAY: Record<string, string> = {
  'g/dl': 'g/dL',
  'mg/dl': 'mg/dL',
  '/ul': '/µL',
  'cells/ul': 'cells/µL',
  'k/ul': 'k/µL',
  '10*3/ul': '×10³/µL',
  '10^3/ul': '×10³/µL',
  'x10e3/ul': '×10³/µL',
  '10*9/l': '×10⁹/L',
  '10^9/l': '×10⁹/L',
  'x10e9/l': '×10⁹/L',
};

export function labUnitLabel(unit: string | undefined): string {
  if (unit == null) return '';
  return UNIT_DISPLAY[unit.toLowerCase()] ?? unit;
}

type LabUnitProps = {
  unit: string | undefined;
};

function LabUnit({ unit }: LabUnitProps) {
  const label = labUnitLabel(unit);
  if (!label) return null;
  return <>{label}</>;
}

export default LabUnit;
