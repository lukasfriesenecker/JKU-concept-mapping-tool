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
  onSelect: (id: number) => void
  isSelected: boolean
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
  onSelect,
  isSelected,
}: ConceptProps) {
  const dragRef = useDraggable(id, scale, onDrag)
  const scaleRef = useScalable(id, onScale, isSelected)

  const handleRadius = 6 / scale

  return (
    <g
      ref={dragRef}
      transform={`translate(${x}, ${y})`}
      onClick={(e) => {
        e.stopPropagation()
        onSelect(id)
      }}
      onDoubleClick={(e) => e.stopPropagation()}
    >
      <rect
        ref={scaleRef}
        width={width}
        height={height}
        rx="4"
        className={`fill-card cursor-pointer transition-colors ${
          isSelected ? 'stroke-primary stroke-1' : 'stroke-border stroke-1'
        }`}
      />

      {isSelected && (
        <g className="pointer-events-none">
          <circle cx="0" cy="0" r={handleRadius} className="fill-ring" />
          <circle cx={width} cy="0" r={handleRadius} className="fill-ring" />
          <circle cx="0" cy={height} r={handleRadius} className="fill-ring" />
          <circle
            cx={width}
            cy={height}
            r={handleRadius}
            className="fill-ring"
          />
        </g>
      )}

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
