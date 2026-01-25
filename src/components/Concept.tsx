import { memo, useLayoutEffect, useRef } from 'react'
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
  onStartConnection: (
    fromId: number,
    event: React.PointerEvent<Element>
  ) => void
  onLabelChange: (id: number, textWidth: string, type: string) => void
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
  onStartConnection,
  onLabelChange,
}: ConceptProps) {
  const dragRef = useDraggable(id, scale, onDrag)
  const scaleRef = useScalable(id, onScale, isSelected)

  const handleRadius = 6 / scale
  const pointerStartPos = useRef({ x: 0, y: 0 })
  const hasMoved = useRef(false)
  const textRef = useRef<SVGTextElement | null>(null)

  useLayoutEffect(() => {
    if (!textRef.current) return
    if (!scaleRef.current) return

    const bbox = textRef.current.getBBox()
    const rect = scaleRef.current.getBBox()
    const textWidth = Math.max(rect.width, bbox.width + 35)

    onLabelChange(id, `${textWidth}px`, 'concept')
  }, [label, id, onLabelChange])

  const handlePointerDown = (e: React.PointerEvent) => {
    pointerStartPos.current = { x: e.clientX, y: e.clientY }
    hasMoved.current = false
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    const distance = Math.sqrt(
      Math.pow(e.clientX - pointerStartPos.current.x, 2) +
        Math.pow(e.clientY - pointerStartPos.current.y, 2)
    )

    if (distance > 5) {
      hasMoved.current = true
    }
  }

  return (
    <g
      ref={dragRef}
      data-concept-id={id}
      transform={`translate(${x}, ${y})`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onClick={(e) => {
        e.stopPropagation()
        if (!hasMoved.current) {
          onSelect(id)
        }
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

      <circle
        cx={50 / 2 - 10}
        cy={25}
        r={8}
        className="fill-ring"
        onPointerDown={(e) => {
          e.stopPropagation()
          onStartConnection(id, e)
        }}
      />

      <text
        ref={textRef}
        x={30}
        y={30}
        className="fill-card-foreground text-sm font-medium select-none"
      >
        {label}
      </text>
    </g>
  )
}

export default memo(Concept)
