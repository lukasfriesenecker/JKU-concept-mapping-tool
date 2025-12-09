import { memo, useState } from 'react'
import useDraggable from '../hooks/useDraggable'
import useScalable from '../hooks/useScalable'

interface ConceptProps {
  id: number
  label: string
  x: number
  y: number
  scale: number
  onDrag: (id: number, dx: number, dy: number) => void
}

function Concept({ id, label, x, y, scale, onDrag }: ConceptProps) {
  const [localScale, setLocalScale] = useState(scale)

  const dragRef = useDraggable(id, scale, onDrag)

  const scaleRef = useScalable(id, localScale, (id, newScale) => {
    setLocalScale(newScale)
  })

  const combinedRef = (el: SVGGElement | null) => {
    dragRef.current = el
  }

  return (
    <g
      ref={combinedRef}
      transform={`translate(${x}, ${y}) scale(${localScale})`}
      onDoubleClick={(e) => e.stopPropagation()}
    >
      <rect
        ref={scaleRef}
        width="100"
        height="50"
        rx="8"
        className="fill-concept-background stroke-concept-border stroke-2 cursor-pointer"
      />

      <circle cx={50 / 2 - 10} cy={25} r={5} className="fill-blue-500" />

      <text
        x={60}
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
