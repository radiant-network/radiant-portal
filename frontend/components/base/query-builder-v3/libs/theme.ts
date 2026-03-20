const theme: string[] = [
  '#C31D7E',
  '#328536',
  '#AA00FF',
  '#C2410C',
  '#047ABE',
  '#E5231F',
  '#007D85',
  '#C51162',
  '#7B5A90',
  '#B85C00',
  '#722ED1',
  '#4D7C0F',
  '#9F1239',
  '#2D7D9A',
  '#847545',
]

export function getColorByIndex(index: number): string {
  return theme[index % theme.length];
}
