import { memo } from 'react'
import useDraggable from '../hooks/useDraggable'

interface ConceptProps {
  id: number
  label: string
  x: number
  y: number
  scale: number
  onDrag: (id: number, dx: number, dy: number) => void
}

function Concept({ id, label, x, y, scale, onDrag }: ConceptProps) {
  const ref = useDraggable(id, scale, onDrag)

  return (
    <g ref={ref} transform={`translate(${x}, ${y})`}>
      <rect
        width="100"
        height="50"
        rx="8"
        className="fill-concept-background stroke-concept-border stroke-2"
      />

      <text
        x={50}
        y={30}
        textAnchor="middle"
        className="text-sm font-medium select-none"
      >
        {label}
      </text>
    </g>
  )
}

export default memo(Concept)
