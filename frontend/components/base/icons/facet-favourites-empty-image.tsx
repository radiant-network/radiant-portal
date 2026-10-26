import { useId } from 'react';

type RowProps = {
  y: number;
  filterId: string;
  opacity?: number;
  barOpacity: number;
  starred?: boolean;
};

function Row({ y, filterId, opacity, barOpacity, starred = false }: RowProps) {
  return (
    <g opacity={opacity} filter={`url(#${filterId})`}>
      <rect x="8.5" y={y + 0.5} width="215" height="31" rx="7.5" fill="var(--card)" stroke="var(--border)" />
      <path
        d={`M22 ${y + 20}L26 ${y + 16}L22 ${y + 12}`}
        opacity="0.5"
        stroke="var(--muted-foreground)"
        strokeWidth="1.33"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect x="40" y={y + 12} width="99" height="8" rx="2" fill="var(--primary)" opacity={barOpacity} />
      {starred && (
        <path
          transform={`translate(0 ${y - 44})`}
          d="M206 54.1667L207.803 57.8184L211.833 58.4075L208.917 61.2484L209.605 65.2617L206 63.3659L202.395 65.2617L203.083 61.2484L200.167 58.4075L204.198 57.8184L206 54.1667Z"
          opacity="0.8"
          fill="var(--primary)"
          stroke="var(--primary)"
          strokeWidth="1.33"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </g>
  );
}

function FacetFavouritesEmptyImage() {
  const filterId = `facet-favourites-empty-shadow-${useId().replace(/[^a-zA-Z0-9-]/g, '')}`;

  return (
    <svg width="232" height="115" viewBox="0 0 232 115" fill="none" aria-hidden="true">
      <Row y={8} filterId={filterId} opacity={0.6} barOpacity={0.2} />
      <Row y={44} filterId={filterId} barOpacity={0.1} starred />
      <Row y={80} filterId={filterId} opacity={0.6} barOpacity={0.2} />
      <defs>
        <filter id={filterId} x="-2" y="-2" width="236" height="119" filterUnits="userSpaceOnUse">
          <feDropShadow dx="0" dy="1" stdDeviation="1" floodOpacity="0.05" />
        </filter>
      </defs>
    </svg>
  );
}

export default FacetFavouritesEmptyImage;
