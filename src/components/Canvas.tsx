import { useCallback, useState, type MouseEvent } from 'react'
import Connection from './Connection'
import Concept from './Concept'
import usePanZoom from '../hooks/usePanZoom'

function Canvas() {
  const { ref, viewport } = usePanZoom()

  const [concepts, setConcepts] = useState([
    { id: 0, label: 'Concept 0', x: 150, y: 200 },
    { id: 1, label: 'Concept 1', x: 150, y: 500 },
  ])

  const [draggingConnection, setDraggingConnection] = useState<{
    from: number
    x: number
    y: number
  } | null>(null)

  const [connections, setConnections] = useState([
    { id: 0, label: 'Connection 0', from: 0, to: 1 },
  ])

  const getConceptCenter = (id: number) => {
    const concept = concepts.find((c) => c.id === id)

    if (!concept) return { x: 0, y: 0 }

    return { x: concept.x + 50, y: concept.y + 25 }
  }

  const handleConceptDrag = useCallback(
    (id: number, dx: number, dy: number) => {
      setConcepts((prevConcepts) =>
        prevConcepts.map((concept) => {
          if (concept.id === id) {
            return {
              ...concept,
              x: concept.x + dx,
              y: concept.y + dy,
            }
          }

          return concept
        })
      )
    },
    []
  )


  const handleCircleMouseDown = (id: number) => {
    const c = concepts.find((cn) => cn.id === id)
    if (!c) return

    const circleOffsetX = 15
    const circleOffsetY = 25

    setDraggingConnection({
      from: id,
      x: c.x + circleOffsetX,
      y: c.y + circleOffsetY,
    })
  }

const handleMouseMove = (event: React.MouseEvent<SVGSVGElement>) => {
  if (!draggingConnection) return;

  const svgRect = event.currentTarget.getBoundingClientRect()
  const { x, y } = toCanvasCoordinates(
    event.clientX - svgRect.left,
    event.clientY - svgRect.top
  )

  setDraggingConnection(prev => prev ? { ...prev, x, y } : null)
}


  const handleMouseUp = () => {

    if (draggingConnection) {
      console.log("mouse up")
      const toConcept = concepts.find(
        (c) =>
          Math.abs(c.x + 50 - draggingConnection.x) < 50 &&
          Math.abs(c.y + 25 - draggingConnection.y) < 25
      )
      if (toConcept && toConcept.id !== draggingConnection.from) {
        setConnections((prev) => [
          ...prev,
          {
            id: Date.now(),
            label: `Connection ${prev.length}`,
            from: draggingConnection.from,
            to: toConcept.id,
          },
        ])
      }
      setDraggingConnection(null)
    }
  }


  const toCanvasCoordinates = useCallback(
    (localX: number, localY: number) => {
      return {
        x: (localX - viewport.x) / viewport.scale,
        y: (localY - viewport.y) / viewport.scale,
      }
    },
    [viewport]
  )

  const handleDoubleClick = (event: MouseEvent<SVGSVGElement>) => {
    const svgElementPosition = event.currentTarget.getBoundingClientRect()
    const localX = event.clientX - svgElementPosition.left
    const localY = event.clientY - svgElementPosition.top

    const { x, y } = toCanvasCoordinates(localX, localY)

    const newConcept = {
      id: concepts.length,
      label: 'Concept ' + concepts.length,
      x: x - 100 / 2,
      y: y - 50 / 2,
    }

    setConcepts((prev) => [...prev, newConcept])
  }

  return (
    <div className="bg-background h-screen w-screen touch-none">
      <div className="bg-background absolute top-10 left-10 rounded-sm px-4 py-3 shadow-lg">
        <h1 className="font-bold">Concept Mapping Tool</h1>
      </div>

      <svg
        ref={ref}
        className="h-full w-full"
        onDoubleClick={handleDoubleClick}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <defs>
          <pattern
            id="dot-pattern"
            x="0"
            y="0"
            width="20"
            height="20"
            patternUnits="userSpaceOnUse"
            patternTransform={`translate(${viewport.x}, ${viewport.y}) scale(${viewport.scale})`}
          >
            <circle cx="2" cy="2" r="1" className="fill-muted-foreground" />
          </pattern>
        </defs>

        <rect className="h-full w-full fill-[url(#dot-pattern)]" />

        {draggingConnection && (
          <line
            x1={getConceptCenter(draggingConnection.from).x}
            y1={getConceptCenter(draggingConnection.from).y}
            x2={draggingConnection.x}
            y2={draggingConnection.y}
            stroke="red"
            strokeWidth={2}
          />
        )}

        <g
          transform={`translate(${viewport.x}, ${viewport.y}) scale(${viewport.scale})`}
        >
          {connections.map((connection) => (
            <Connection
              key={connection.id}
              label={connection.label}
              start={getConceptCenter(connection.from)}
              end={getConceptCenter(connection.to)}
            />
          ))}

          {concepts.map((concept) => (
            <Concept
              key={concept.id}
              id={concept.id}
              label={concept.label}
              x={concept.x}
              y={concept.y}
              scale={viewport.scale}
              onDrag={handleConceptDrag}
              onCircleMouseDown={handleCircleMouseDown}
            />
          ))}
        </g>
      </svg>
    </div>
  )
}

export default Canvas
