type D3RegionProps = {
  id?: string;
  clipPaths: string[];
  variant: 'outline' | 'fill';
  disabled?: boolean;
  selected?: boolean;
  onClick?: () => void;
};

function D3Region({ clipPaths, variant, id, onClick, disabled = false, selected = false }: D3RegionProps) {
  if (clipPaths.length === 0) return null;

  let className = 'transition-colors fill-primary/30 hover:fill-primary/40 cursor-pointer';
  if (variant === 'outline') {
    className = 'fill-border';
  } else if (disabled) {
    className = 'transition-colors fill-muted cursor-default hover:fill-muted';
  } else if (selected) {
    className = 'fill-primary/50 cursor-pointer';
  }

  return clipPaths.reduceRight<React.ReactElement>(
    (child, clip) => <g clipPath={`url(#${clip})`}>{child}</g>,
    <rect
      id={id}
      width="100%"
      height="100%"
      className={className}
      onClick={() => {
        if (disabled) return;
        onClick?.();
      }}
    />,
  );
}

export default D3Region;
