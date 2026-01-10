interface ConnectionProps {
  label: string
  start: {
    x: number
    y: number
  }
  end: {
    x: number
    y: number
  }
}

function Connection({ label, start, end }: ConnectionProps) {
  const centerX = (start.x + end.x) / 2
  const centerY = (start.y + end.y) / 2

  return (
    <g>
      <line
        x1={start.x}
        y1={start.y}
        x2={end.x}
        y2={end.y}
        className="stroke-card-foreground stroke-1"
      />

      <g>
        <rect
          x={centerX - 45}
          y={centerY - 15}
          width="90"
          height="30"
          rx="15"
          ry="15"
          className="fill-card stroke-border stroke-1"
        />

        <text
          x={centerX}
          y={centerY}
          textAnchor="middle"
          dominantBaseline="middle"
          className="fill-card-foreground text-xs font-medium"
        >
          {label}
        </text>
      </g>
    </g>
  )
}

export default Connection
