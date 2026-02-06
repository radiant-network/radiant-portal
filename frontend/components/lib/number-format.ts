import { i18n } from '../hooks/i18n';

const VALUE_SYMBOLE_LIST = [
  { symbol: 'K', value: 1e3 },
  { symbol: 'M', value: 1e6 },
  { symbol: 'G', value: 1e9 },
  { symbol: 'T', value: 1e12 },
  { symbol: 'P', value: 1e15 },
  { symbol: 'E', value: 1e18 },
];

const BLACK_LIST_LENGTH = [1, 2, 3, 4];
const NUM_FORMAT_REGEX = /\.0+$|(\.[0-9]*[1-9])0+$/;

export function getDefaultDigits(num: number): number {
  switch (num.toString().length) {
    case 5:
    case 7:
      return 1;
    default:
      return 0;
  }
}

export function thousandNumberFormat(value: number, options?: Intl.NumberFormatOptions) {
  return new Intl.NumberFormat(i18n.language, {
    useGrouping: true,
    ...options,
  }).format(value);
}

export function numberFormatWithAbbrv(num: number, digits = 0): number | string {
  if (!num) return 0;

  let index: number;
  digits = digits ? digits : getDefaultDigits(num);

  if (BLACK_LIST_LENGTH.includes(num.toString().length)) {
    return new Intl.NumberFormat(i18n.language, {
      useGrouping: true,
    }).format(num);
  }

  VALUE_SYMBOLE_LIST.forEach((si: any, i) => {
    if (num >= si.value) {
      index = i;
      return false;
    }
  });

  return (
    (num / VALUE_SYMBOLE_LIST[index!].value).toFixed(digits).replace(NUM_FORMAT_REGEX, '$1') +
    VALUE_SYMBOLE_LIST[index!].symbol
  );
}

export function toExponentialNotation(numberCandidate?: number, fractionDigits = 2): string {
  return numberCandidate ? numberCandidate.toExponential(fractionDigits) : '';
}

export function toExponentialNotationAtThreshold(
  numberCandidate: number,
  threshold = 0.001,
  fractionDigits = 2,
): string {
  return numberCandidate < threshold
    ? toExponentialNotation(numberCandidate, fractionDigits)
    : numberCandidate.toString();
}

export function canQuotientBeComputed(num: number, denum: number): boolean {
  const areNumbers = !isNaN(num) && !isNaN(denum);
  return areNumbers && denum !== 0;
}

export function formatQuotientToExponentialOrElse(num: number, denum: number, defaultValue = ''): string {
  return canQuotientBeComputed(num, denum) ? `${toExponentialNotation(num / denum)}` : defaultValue;
}

export function formatQuotientOrElse(num: number, denum: number, defaultValue = ''): string {
  return canQuotientBeComputed(num, denum) ? `${num} / ${denum}` : defaultValue;
}

/* < 1,000 bp display bp after the number, no decimals
 * e.g. 857 bp
 * ≥ 1,000 bp and < 1,000,000 bp display kb after the number with Two decimal places.
 * e.g. 2.45 kb
 * ≥ 1,000,000 bp and < 1,000,000,000 bp display mb after the number with Two decimal places.
 * e.g. 1.25 mb
 */
export function toKiloBases(num: number): string {
  if (num < 1000) {
    return `${thousandNumberFormat(num)} bp`;
  }

  if (num < 1000000) {
    return `${thousandNumberFormat(num / 1000, { minimumFractionDigits: 1, maximumFractionDigits: 1 })} kb`;
  }

  return `${thousandNumberFormat(num / 1000000, { minimumFractionDigits: 1, maximumFractionDigits: 1 })} mb`;
}
