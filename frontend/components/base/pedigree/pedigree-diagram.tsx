import type { TFunction } from 'i18next';

import { useI18n } from '@/components/hooks/i18n';
import { cn } from '@/components/lib/utils';

export type PedigreeSex = 'male' | 'female' | 'unknown';

export type PedigreeMember = {
  key: string;
  label: string;
  sublabel?: string;
  sex: PedigreeSex;
  isProband?: boolean;
  isAffected?: boolean;
  /** Not sequenced members get a dashed outline */
  isSequenced?: boolean;
  status?: 'error';
};

type PedigreeDiagramProps = {
  father?: PedigreeMember;
  mother?: PedigreeMember;
  offspring: PedigreeMember[];
  className?: string;
};

const SYMBOL_SIZE = 32;
const HALF = SYMBOL_SIZE / 2;
const COUPLE_GAP = 180;
const CHILD_GAP = 140;
const LABEL_SLOT = 140;
const TOP_ROW_Y = 24;
const SIBSHIP_Y = 96;
const BOTTOM_ROW_Y = 132;
const LABEL_LINE_HEIGHT = 18;
const LABEL_FIRST_LINE = HALF + 20;
const LABELS_HEIGHT = LABEL_FIRST_LINE + LABEL_LINE_HEIGHT + 8;
const LINE_CLASS = 'stroke-muted-foreground';

type PedigreeSymbolProps = {
  member: PedigreeMember;
  x: number;
  y: number;
};

function PedigreeSymbol({ member, x, y }: PedigreeSymbolProps) {
  const isError = member.status === 'error';
  const isSequenced = member.isSequenced ?? true;
  const strokeClass = cn({
    'stroke-destructive': isError,
    'stroke-muted-foreground': !isError && !isSequenced,
    'stroke-foreground': !isError && isSequenced,
  });
  const fillClass = cn({
    'fill-background': !member.isAffected,
    'fill-destructive': member.isAffected && isError,
    'fill-foreground': member.isAffected && !isError,
  });
  const shapeProps = {
    className: cn(strokeClass, fillClass),
    strokeWidth: 2,
    strokeDasharray: isSequenced ? undefined : '4 3',
  };

  return (
    <g>
      {member.sex === 'male' && (
        <rect x={x - HALF} y={y - HALF} width={SYMBOL_SIZE} height={SYMBOL_SIZE} {...shapeProps} />
      )}
      {member.sex === 'female' && <circle cx={x} cy={y} r={HALF} {...shapeProps} />}
      {member.sex === 'unknown' && (
        <polygon
          points={`${x},${y - HALF - 2} ${x + HALF + 2},${y} ${x},${y + HALF + 2} ${x - HALF - 2},${y}`}
          {...shapeProps}
        />
      )}

      {member.isProband && (
        <g className="stroke-foreground" strokeWidth={2} strokeLinecap="round" fill="none">
          <line x1={x - HALF - 22} y1={y + HALF + 6} x2={x - HALF - 6} y2={y + HALF - 10} />
          <polyline
            points={`${x - HALF - 13},${y + HALF - 10} ${x - HALF - 6},${y + HALF - 10} ${x - HALF - 6},${y + HALF - 3}`}
          />
        </g>
      )}

      <text
        x={x}
        y={y + LABEL_FIRST_LINE}
        textAnchor="middle"
        className={cn('text-sm', {
          'fill-destructive font-semibold': isError,
          'fill-foreground': !isError,
          'font-semibold': member.isProband,
        })}
      >
        {member.label}
      </text>
      {member.sublabel && (
        <text
          x={x}
          y={y + LABEL_FIRST_LINE + LABEL_LINE_HEIGHT}
          textAnchor="middle"
          className="fill-muted-foreground text-xs"
        >
          {member.sublabel}
        </text>
      )}
    </g>
  );
}

const SEX_KEYS: Record<PedigreeSex, string> = {
  male: 'a11y.pedigree.male',
  female: 'a11y.pedigree.female',
  unknown: 'a11y.pedigree.unknown_sex',
};

/**
 * Text read by screen readers: everything the symbol shows, without repeating the labels.
 */
function getMemberDescription(member: PedigreeMember, t: TFunction<string, undefined>) {
  const probandLabel = t('a11y.pedigree.proband');
  const labelNamesProband = member.label.toLowerCase().includes(probandLabel.toLowerCase());

  return [
    member.label,
    member.sublabel,
    t(SEX_KEYS[member.sex]),
    member.isProband && !labelNamesProband && probandLabel,
    member.isAffected ? t('a11y.pedigree.affected') : t('a11y.pedigree.not_affected'),
    member.isSequenced === false && !member.sublabel && t('a11y.pedigree.not_sequenced'),
    member.status === 'error' && t('a11y.pedigree.failed'),
  ]
    .filter(Boolean)
    .join(', ');
}

function PedigreeDiagram({ father, mother, offspring, className }: PedigreeDiagramProps) {
  const { t } = useI18n();
  const hasParents = Boolean(father || mother);
  const childrenSpan = Math.max(offspring.length - 1, 0) * CHILD_GAP;
  const width = Math.max(childrenSpan, hasParents ? COUPLE_GAP : 0) + LABEL_SLOT;
  const middle = width / 2;
  const fatherX = middle - COUPLE_GAP / 2;
  const motherX = middle + COUPLE_GAP / 2;
  const childrenY = hasParents ? BOTTOM_ROW_Y : TOP_ROW_Y;
  const childrenX = offspring.map((_, index) => middle - childrenSpan / 2 + index * CHILD_GAP);
  const height = childrenY + LABELS_HEIGHT;
  const members = [father, mother, ...offspring].filter((member): member is PedigreeMember => Boolean(member));

  return (
    <div className={className}>
      <svg
        aria-hidden
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className="max-w-full overflow-visible"
      >
        {hasParents && (
          <g className={LINE_CLASS} strokeWidth={2}>
            <line
              x1={father ? fatherX + HALF : middle}
              y1={TOP_ROW_Y}
              x2={mother ? motherX - HALF : middle}
              y2={TOP_ROW_Y}
            />
            {offspring.length === 1 && <line x1={middle} y1={TOP_ROW_Y} x2={middle} y2={childrenY - HALF} />}
            {offspring.length > 1 && (
              <>
                <line x1={middle} y1={TOP_ROW_Y} x2={middle} y2={SIBSHIP_Y} />
                <line x1={childrenX[0]} y1={SIBSHIP_Y} x2={childrenX[childrenX.length - 1]} y2={SIBSHIP_Y} />
                {childrenX.map(x => (
                  <line key={x} x1={x} y1={SIBSHIP_Y} x2={x} y2={childrenY - HALF} />
                ))}
              </>
            )}
          </g>
        )}

        {father && <PedigreeSymbol member={father} x={fatherX} y={TOP_ROW_Y} />}
        {mother && <PedigreeSymbol member={mother} x={motherX} y={TOP_ROW_Y} />}
        {offspring.map((child, index) => (
          <PedigreeSymbol key={child.key} member={child} x={childrenX[index]} y={childrenY} />
        ))}
      </svg>

      <ul className="sr-only" aria-label={t('a11y.pedigree.members')}>
        {members.map(member => (
          <li key={member.key}>{getMemberDescription(member, t)}</li>
        ))}
      </ul>
    </div>
  );
}

export default PedigreeDiagram;
