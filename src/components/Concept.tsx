import { memo } from 'react'
import useDraggable from '../hooks/useDraggable'
import useScalable from '../hooks/useScalable'

interface ConceptProps {
  id: number
  label: string
  x: number
  y: number
  width: string
  height: string
  scale: number
  onDrag: (id: number, dx: number, dy: number) => void
  onScale: (
    id: number,
    dx: number,
    dy: number,
    width: string,
    height: string
  ) => void
}

function Concept({
  id,
  label,
  x,
  y,
  width,
  height,
  scale,
  onDrag,
  onScale,
}: ConceptProps) {
  const dragRef = useDraggable(id, scale, onDrag)

  const scaleRef = useScalable(id, onScale)

  return (
    <g
      ref={dragRef}
      transform={`translate(${x}, ${y})`}
      onDoubleClick={(e) => e.stopPropagation()}
    >
      <rect
        ref={scaleRef}
        width={width}
        height={height}
        rx="8"
        className="fill-card stroke-border cursor-pointer stroke-1"
      />

      <circle cx={50 / 2 - 10} cy={25} r={8} className="fill-ring" />

      <text
        x={60}
        y={30}
        textAnchor="middle"
        className="fill-card-foreground text-sm font-medium select-none"
      >
        {label}
      </text>
    </g>
  )
}

export default memo(Concept)
