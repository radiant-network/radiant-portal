type D3ClipCircleProps = {
  id: string;
  cx: number;
  cy: number;
  r: number;
};

function D3ClipCircle({ id, cx, cy, r }: D3ClipCircleProps) {
  return (
    <clipPath id={id}>
      <circle cx={cx} cy={cy} r={r} />
    </clipPath>
  );
}

export default D3ClipCircle;
