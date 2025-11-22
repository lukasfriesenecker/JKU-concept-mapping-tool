import { useCallback, useState } from 'react'
import Connection from './Connection'
import Concept from './Concept'
import usePanZoom from '../hooks/usePanZoom'

function Canvas() {
  const { ref, viewport } = usePanZoom()

  const [concepts, setConcepts] = useState([
    { id: 1, label: 'Concept 1', x: 150, y: 200 },
    { id: 2, label: 'Concept 2', x: 150, y: 500 },
  ])

  const [connections, setConnections] = useState([
    { id: 1, label: 'Connection 1', from: 1, to: 2 },
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

  return (
    <div className="bg-background h-screen w-screen touch-none">
      <div className="bg-background absolute top-10 left-10 rounded-sm px-4 py-3 shadow-lg">
        <h1 className="font-bold">Concept Mapping Tool</h1>
      </div>

      <svg ref={ref} className="h-full w-full">
        <defs>
          <pattern
            id="dot-pattern"
            x={viewport.x}
            y={viewport.y}
            width="20"
            height="20"
            patternUnits="userSpaceOnUse"
            patternTransform={`scale(${viewport.scale})`}
          >
            <circle cx="2" cy="2" r="1" className="fill-muted-foreground" />
          </pattern>
        </defs>

        <rect className="h-full w-full fill-[url(#dot-pattern)]" />

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
              onDrag={handleConceptDrag}
            />
          ))}
        </g>
      </svg>
    </div>
  )
}

export default Canvas
