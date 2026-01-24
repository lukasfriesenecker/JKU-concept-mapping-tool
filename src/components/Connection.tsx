import { useLayoutEffect, useRef } from "react"

interface ConnectionProps {
  id: number
  label: string
  from: {
    x: number
    y: number
  }
  to: {
    x: number
    y: number
  }
  onLabelChange: (id: number, textWidth: string, type: string) => void
  width: string
}

function Connection({ id, label, from, to, onLabelChange, width }: ConnectionProps) {
  const x = (from.x + to.x) / 2
  const y = (from.y + to.y) / 2
  const height = "30"
  const textRef = useRef<SVGTextElement | null>(null)

  useLayoutEffect(() => {
    if (!textRef.current) return

    const bbox = textRef.current.getBBox()
    const textWidth = Math.max(90, bbox.width);

    onLabelChange(id, `${textWidth}px`, "connection")
  }, [label, id, onLabelChange])

  return (
    <g>
      <line
        x1={from.x}
        y1={from.y}
        x2={to.x}
        y2={to.y}
        className="stroke-card-foreground stroke-1"
      />

      <g>
        <rect
          x={x- 45}
          y={y - 15}
          width={`${parseFloat(width) + 10}px`}
          height={height}
          rx="15"
          ry="15"
          className="fill-card stroke-border stroke-1"
        />

        <text
          ref={textRef}
          x={x - 40}
          y={y}
          textAnchor="start"
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
