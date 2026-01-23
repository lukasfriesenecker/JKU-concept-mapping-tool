/// <reference types="@types/wicg-file-system-access" />
import { useCallback, useEffect, useState, type MouseEvent } from 'react'
import Connection from './Connection'
import Concept from './Concept'
import usePanZoom from '../hooks/usePanZoom'
import Toolbar from './Toolbar'
import ConceptMenu from './ConceptMenu'
import { toast } from 'sonner'
import KeyboardWrapper from './KeyboardWrapper'

function Canvas() {
  const { ref, viewport } = usePanZoom()

  const [selectedConceptIds, setselectedConceptIds] = useState<number[]>([])
  const [editingConceptIds, setEditingConceptIds] = useState<number[]>([])
  const STORAGE_KEY = 'concept-map-data'


  type Concept = {
    id: number
    label: string
    x: number
    y: number
    width: string
    height: string
  }

  type Connection = {
    id: number
    label: string
    from: number
    to: number
  }

  const startEditing = (id: number) => {
    setEditingConceptIds((prev) => (prev.includes(id) ? prev : [...prev, id]))
    deselectConcept(id);
  }

  const stopEditing = (id: number) => {
    setEditingConceptIds((prev) => prev.filter((eid) => eid !== id))
  }

  const toggleSelection = useCallback((id: number) => {
    setselectedConceptIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((sid) => sid !== id)
      } else {
        stopEditing(id);
        return [...prev, id]
      }
    })
  }, [])

  const deselectConcept = (id: number) => {
    setselectedConceptIds((prev) => prev.filter((sid) => sid !== id))
  }

  const renameConcept = (id: number) => {
    startEditing(id)
  }

  const deleteConcept = useCallback((id: number) => {
    setConcepts((prev) => prev.filter((concept) => concept.id !== id))
    setselectedConceptIds((prev) => prev.filter((sid) => sid !== id))
    setConnections((prev) =>
      prev.filter((conn) => conn.from !== id && conn.to !== id)
    )
  }, [])

  const [title, setTitle] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return 'Neue Concept Map'
    try {
      return JSON.parse(stored).title ?? 'Neue Concept Map'
    } catch {
      return 'Neue Concept Map'
    }
  })

  const [description, setDescription] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return 'Neue Concept Map Beschreibung'
    try {
      return JSON.parse(stored).description ?? 'Neue Concept Map Beschreibung'
    } catch {
      return 'Neue Concept Map Beschreibung'
    }
  })

  const [concepts, setConcepts] = useState<Concept[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return [
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
    ]

    try {
      return JSON.parse(stored).concepts ?? []
    } catch {
      return []
    }
  })

  const [connections, setConnections] = useState<Connection[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return [{ id: 0, label: 'Connection 0', from: 0, to: 1 }]

    try {
      return JSON.parse(stored).connections ?? []
    } catch {
      return []
    }
  })

  useEffect(() => {
    const data = {
      title,
      description,
      concepts,
      connections,
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  }, [concepts, connections, title, description])


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

  const handleOnEnter = useCallback(
    (id: number) => {
      stopEditing(id);
    },
    []
  )

  const lableChangeWidthAdjustment = useCallback(
    (id: number, value: string) => {
      setConcepts((prevConcepts) =>
        prevConcepts.map((concept) => {
          if (concept.id === id) {
            return {
              ...concept,
              width: value
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

    const newConcept: Concept = {
      id: concepts.length,
      label: 'Concept ' + concepts.length,
      x: x - 100 / 2,
      y: y - 50 / 2,
      width: '100px',
      height: '50px',
    }

    setConcepts((prev) => [...prev, newConcept])
  }

  const [activePointerConnections, setActivePointerConnections] = useState<
    Record<
      number,
      {
        fromId: number
        currentX: number
        currentY: number
      }
    >
  >({})

  const handleStartConnection = (fromId: number, event: React.PointerEvent) => {
    ; (event.target as Element).setPointerCapture(event.pointerId)

    const svgRect = ref.current?.getBoundingClientRect()
    if (!svgRect) return

    const { x, y } = toCanvasCoordinates(
      event.clientX - svgRect.left,
      event.clientY - svgRect.top
    )

    setActivePointerConnections((prev) => ({
      ...prev,
      [event.pointerId]: { fromId, currentX: x, currentY: y },
    }))
  }

  const handlePointerMove = (event: React.PointerEvent) => {
    if (!activePointerConnections[event.pointerId]) return

    const svgRect = ref.current?.getBoundingClientRect()
    if (!svgRect) return

    const { x, y } = toCanvasCoordinates(
      event.clientX - svgRect.left,
      event.clientY - svgRect.top
    )

    setActivePointerConnections((prev) => ({
      ...prev,
      [event.pointerId]: { ...prev[event.pointerId], currentX: x, currentY: y },
    }))
  }

  const handleGlobalPointerUp = (event: React.PointerEvent) => {
    const pending = activePointerConnections[event.pointerId]
    if (!pending) return

    const elementAtPoint = document.elementFromPoint(
      event.clientX,
      event.clientY
    )

    const conceptElement = elementAtPoint?.closest('g[data-concept-id]')
    const toId = conceptElement
      ? parseInt(conceptElement.getAttribute('data-concept-id') || '')
      : null

    if (toId !== null && pending.fromId !== toId) {
      const newConnection: Connection = {
        id: connections.length,
        label: 'Connection' + connections.length,
        from: pending.fromId,
        to: toId,
      }

      setConnections((prev) => [...prev, newConnection])
    }

    setActivePointerConnections((prev) => {
      const next = { ...prev }

      delete next[event.pointerId]

      return next
    })
  }

  const [fileHandle, setFileHandle] = useState<FileSystemFileHandle | null>(
    null
  )

  const supportsFileSystemAccess =
    'showSaveFilePicker' in window &&
    (() => {
      try {
        return window.self === window.top
      } catch {
        return false
      }
    })()

  const handleSaveAs = async () => {
    if (supportsFileSystemAccess) {
      try {
        const handle = await window.showSaveFilePicker({
          suggestedName: 'concept_map.json',
          types: [
            {
              description: 'JSON File',
              accept: { 'application/json': ['.json'] },
            },
          ],
        })

        setFileHandle(handle)
        await writeToFile(handle)
        toast.success('Datei gepsichert', { position: 'bottom-center' })
      } catch (error) {
        toast.error('Fehler beim Speichern der Datei', {
          position: 'bottom-center',
        })
        console.error(error)
      }
    }
  }

  const handleSave = async () => {
    if (supportsFileSystemAccess) {
      try {
        if (!fileHandle) {
          return handleSaveAs()
        }

        await writeToFile(fileHandle)
        toast.success('Datei gespeichert', { position: 'bottom-center' })
      } catch (error) {
        toast.error('Fehler beim Speichern der Datei', {
          position: 'bottom-center',
        })
        console.error(error)
      }
    }
  }

  const handleSaveProjectInfo = (newTitle: string, newDesc: string) => {
    setTitle(newTitle)
    setDescription(newDesc)
  }

  const writeToFile = async (handle: FileSystemFileHandle) => {
    const projectData = {
      title: title,
      description: description,
      concepts: concepts,
      connections: connections,
    }

    const writable = await handle.createWritable()
    await writable.write(JSON.stringify(projectData, null, 2))
    await writable.close()
  }

  return (
    <div className="bg-background h-screen w-screen touch-none">
      <Toolbar title={title}
        description={description} onSaveProjectInfo={handleSaveProjectInfo} onSave={handleSave} onSaveAs={handleSaveAs} />

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



      <div className="pointer-events-none absolute inset-0">
        {editingConceptIds.map((id) => {
          const concept = concepts.find((c) => c.id === id)
          if (!concept) return null
          return (
            <div key={`keyboard-${id}`} className="pointer-events-auto">
              <KeyboardWrapper concept={concept} viewport={viewport} onEnter={handleOnEnter} onChange={handleLabelChange} />
            </div>
          )
        })}

      </div>


      <svg
        ref={ref}
        className="h-full w-full"
        onDoubleClick={handleDoubleClick}
        onPointerMove={handlePointerMove}
        onPointerUp={handleGlobalPointerUp}
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
              isSelected={selectedConceptIds.includes(concept.id)}
              onStartConnection={handleStartConnection}
              onLabelChange={lableChangeWidthAdjustment}
            />
          ))}


          {Object.entries(activePointerConnections).map(
            ([pointerId, pending]) => {
              const startPos = getConceptCenter(pending.fromId)

              return (
                <line
                  key={`${pointerId}`}
                  x1={startPos.x - 35}
                  y1={startPos.y}
                  x2={pending.currentX}
                  y2={pending.currentY}
                  className="stroke-card-foreground pointer-events-none stroke-1"
                />
              )
            }
          )}
        </g>
      </svg>
    </div>
  )
}

export default Canvas
