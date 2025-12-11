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

  const [rect, setRect] = useState({
    x: 0,
    y: 0,
    width: 100,
    height: 50
  });

  const dragRef = useDraggable(id, scale, onDrag)

  const scaleRef = useScalable(id, rect, (newRect) => {
    setRect(newRect);
  });


  return (
    <g
      ref={dragRef}
      transform={`translate(${x}, ${y})`}
      onDoubleClick={(e) => e.stopPropagation()}
    >
      <rect
        ref={scaleRef}
        x={rect.x}
        y={rect.y}
        width={rect.width}
        height={rect.height}
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
