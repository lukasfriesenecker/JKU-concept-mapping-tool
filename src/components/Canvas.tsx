import { useCallback, useState, type MouseEvent } from 'react'
import Connection from './Connection'
import Concept from './Concept'
import usePanZoom from '../hooks/usePanZoom'
import Toolbar from './Toolbar'
import ConceptMenu from './ConceptMenu'

function Canvas() {
  const { ref, viewport } = usePanZoom()

  const [selectedConceptIds, setselectedConceptIds] = useState<number[]>([])
  const [editingConceptIds, setEditingConceptIds] = useState<number[]>([]);

  const toggleEditing = (id: number) => {
    setEditingConceptIds(prev =>
      prev.includes(id)
        ? prev.filter((eid) => eid !== id)
        : [...prev, id]
    );
  };

  const startEditing = (id: number) => {
    setEditingConceptIds(prev => prev.includes(id) ? prev : [...prev, id]);
  };

  const stopEditing = (id: number) => {
    setEditingConceptIds(prev => prev.filter(eid => eid !== id));
  };


  const toggleSelection = useCallback((id: number) => {
    setselectedConceptIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((sid) => sid !== id)
      } else {
        return [...prev, id]
      }
    })
  }, [])

  const deselectConcept = (id: number) => {
    setselectedConceptIds((prev) => prev.filter((sid) => sid !== id))
  }

  const renameConcept = (id: number) => {
    startEditing(id);
  }


  const deleteConcept = useCallback((id: number) => {
    setConcepts((prev) => prev.filter((concept) => concept.id !== id))
    setselectedConceptIds((prev) => prev.filter((sid) => sid !== id))
    setConnections((prev) => prev.filter((conn) => conn.from !== id && conn.to !== id))
  }, [])


  const [concepts, setConcepts] = useState([
    {
      id: 0,
      label: 'Concept 0',
      x: 150,
      y: 200,
      width: '100px',
      height: '50px',
    },
    {
      id: 1,
      label: 'Concept 1',
      x: 150,
      y: 500,
      width: '100px',
      height: '50px',
    },
  ])

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

  const handleLabelChange = useCallback(
    (id: number, value: string) => {
      setConcepts((prevConcepts) =>
        prevConcepts.map((concept) => {
          if (concept.id === id) {
            return {
              ...concept,
              label: value,
            }
          }
          return concept
        })
      )
    },
    []
  )

  const handleConceptScale = useCallback(
    (id: number, dx: number, dy: number, width: string, height: string) => {
      setConcepts((prevConcepts) =>
        prevConcepts.map((concept) => {
          if (concept.id === id) {
            return {
              ...concept,
              x: concept.x + dx,
              y: concept.y + dy,
              width: width,
              height: height,
            }
          }
          return concept
        })
      )
    },
    []
  )

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
      width: '100px',
      height: '50px',
    }

    setConcepts((prev) => [...prev, newConcept])
  }

  return (
    <div className="bg-background h-screen w-screen touch-none">
      <Toolbar />

      <div className="pointer-events-none absolute inset-0">
        {selectedConceptIds.map((id) => {
          const concept = concepts.find((c) => c.id === id)
          if (!concept) return null

          return (
            <div key={`menu-${id}`} className="pointer-events-auto">
              <ConceptMenu
                concept={concept}
                viewport={viewport}
                onDeselect={deselectConcept}
                onDelete={deleteConcept}
                onRename={renameConcept}
              />
            </div>
          )
        })}
      </div>

      <svg
        ref={ref}
        className="h-full w-full"
        onDoubleClick={handleDoubleClick}
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
              width={concept.width}
              height={concept.height}
              scale={viewport.scale}
              onDrag={handleConceptDrag}
              onScale={handleConceptScale}
              onSelect={toggleSelection}
              editing={editingConceptIds.includes(concept.id)}
              onStartEditing={() => startEditing(concept.id)}
              onStopEditing={() => stopEditing(concept.id)}
              onLabelChange={handleLabelChange}
              isSelected={selectedConceptIds.includes(concept.id)}
            />
          ))}
        </g>
      </svg>
    </div>
  )
}

export default Canvas
