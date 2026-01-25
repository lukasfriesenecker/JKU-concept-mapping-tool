/// <reference types="@types/wicg-file-system-access" />
import { useCallback, useEffect, useState, type MouseEvent } from 'react'
import Connection from './Connection'
import Concept from './Concept'
import usePanZoom from '../hooks/usePanZoom'
import Toolbar from './Toolbar'
import ConceptMenu from './ConceptMenu'
import { toast } from 'sonner'
import KeyboardWrapper from './KeyboardWrapper/KeyboardWrapperConcept'
import KeyboardWrapperConnection from './KeyboardWrapper/KeyboardWrapperConnection'
import type { IConcept } from './interfaces/Concept'
import type { IConnection } from './interfaces/Connection'

function Canvas() {
  const { ref, viewport } = usePanZoom()

  const [selectedConceptIds, setselectedConceptIds] = useState<number[]>([])
  const [editingConceptIds, setEditingConceptIds] = useState<number[]>([])
  const [editingConncetionIds, setEditingConnectionIds] = useState<number[]>([])

  const STORAGE_KEY = 'concept-map-data'

  const startEditingConcept = (id: number) => {
    setEditingConceptIds((prev) => (prev.includes(id) ? prev : [...prev, id]))
    deselectConcept(id)
  }

  const stopEditingConcept = (id: number) => {
    setEditingConceptIds((prev) => prev.filter((eid) => eid !== id))
  }

  const startEditingConnection = (id: number) => {
    setEditingConnectionIds((prev) =>
      prev.includes(id) ? prev : [...prev, id]
    )
  }

  const stopEditingConnection = (id: number) => {
    setEditingConnectionIds((prev) => prev.filter((eid) => eid !== id))
  }

  const toggleSelection = useCallback((id: number) => {
    setselectedConceptIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((sid) => sid !== id)
      } else {
        stopEditingConcept(id)
        return [...prev, id]
      }
    })
  }, [])

  const deselectConcept = (id: number) => {
    setselectedConceptIds((prev) => prev.filter((sid) => sid !== id))
  }

  const renameConcept = (id: number) => {
    startEditingConcept(id)
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

  const [concepts, setConcepts] = useState<IConcept[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored)
      return [
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

  const [connections, setConnections] = useState<IConnection[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored)
      return [{ id: 0, label: 'Connection 0', from: 0, to: 1, width: '90' }]

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
    (id: number, value: string, type: string) => {
      if (type == 'concept') {
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
      } else {
        setConnections((prevConnections) =>
          prevConnections.map((con) => {
            if (con.id === id) {
              return {
                ...con,
                label: value,
              }
            }
            return con
          })
        )
      }
    },
    []
  )

  const handleOnEnter = useCallback((id: number, type: string) => {
    if (type == 'concept') {
      stopEditingConcept(id)
    } else {
      stopEditingConnection(id)
    }
  }, [])

  const lableChangeWidthAdjustment = useCallback(
    (id: number, value: string, type: string) => {
      if (type == 'concept') {
        setConcepts((prevConcepts) =>
          prevConcepts.map((concept) => {
            if (concept.id === id) {
              return {
                ...concept,
                width: value,
              }
            }
            return concept
          })
        )
      } else {
        setConnections((prevConnections) =>
          prevConnections.map((con) => {
            if (con.id === id) {
              return {
                ...con,
                width: value,
              }
            }
            return con
          })
        )
      }
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

    const newConcept: IConcept = {
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
    ;(event.target as Element).setPointerCapture(event.pointerId)

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
      const newConnection: IConnection = {
        id: connections.length,
        label: 'Connection' + connections.length,
        from: pending.fromId,
        to: toId,
        width: '90',
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
  const [lastSavedData, setLastSavedData] = useState<string>('')

  useEffect(() => {
    const initialData = {
      title,
      description,
      concepts,
      connections,
    }
    setLastSavedData(JSON.stringify(initialData))
  }, [])

  const currentData = {
    title,
    description,
    concepts,
    connections,
  }

  const currentDataString = JSON.stringify(currentData)

  const hasChanges = currentDataString !== lastSavedData

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
        if ((error as Error).name !== 'AbortError') {
          toast.error('Fehler beim Speichern der Datei', {
            position: 'bottom-center',
          })
          console.error(error)
        }
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

    setLastSavedData(JSON.stringify(projectData))
  }

  const handleOpen = async () => {
    if (supportsFileSystemAccess) {
      try {
        const [handle] = await window.showOpenFilePicker({
          types: [
            {
              description: 'JSON File',
              accept: { 'application/json': ['.json'] },
            },
          ],
          multiple: false,
        })

        const file = await handle.getFile()
        const content = await file.text()
        const data = JSON.parse(content)

        loadDataIntoState(data, handle)
        toast.success('Projekt geöffnet', { position: 'bottom-center' })
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          toast.error('Fehler beim Öffnen der Datei')
          console.error(error)
        }
      }
    }
  }

  const loadDataIntoState = (
    data: any,
    handle: FileSystemFileHandle | null
  ) => {
    setConcepts(data.concepts)
    setConnections(data.connections)
    setTitle(data.title)
    setDescription(data.description)
    setFileHandle(handle)
    setselectedConceptIds([])
    setLastSavedData(JSON.stringify(data))
  }

  const handleNewProject = () => {
    setConcepts([])
    setConnections([])
    setTitle('Neue Concept Map')
    setDescription('Neue Concept Map Beschreibung')

    setFileHandle(null)

    setselectedConceptIds([])
    setEditingConceptIds([])
    setEditingConnectionIds([])
    setLastSavedData('')

    toast.success('Neues Projekt erstellt', { position: 'bottom-center' })
  }

  return (
    <div className="bg-background h-screen w-screen touch-none">
      <Toolbar
        title={title}
        description={description}
        onSaveProjectInfo={handleSaveProjectInfo}
        onSave={handleSave}
        onSaveAs={handleSaveAs}
        onOpen={handleOpen}
        onNewProject={handleNewProject}
        isSaveDisabled={!hasChanges}
      />

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
              <KeyboardWrapper
                concept={concept}
                viewport={viewport}
                onEnter={handleOnEnter}
                onChange={handleLabelChange}
              />
            </div>
          )
        })}
      </div>

      <div className="pointer-events-none absolute inset-0">
        {editingConncetionIds.map((id) => {
          const connection = connections.find((c) => c.id === id)
          if (!connection) return null
          return (
            <div key={`keyboard-con-${id}`} className="pointer-events-auto">
              <KeyboardWrapperConnection
                connection={connection}
                from={getConceptCenter(connection.from)}
                to={getConceptCenter(connection.to)}
                viewport={viewport}
                onEnter={handleOnEnter}
                onChange={handleLabelChange}
              />
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
            <g
              key={connection.id}
              onClick={() => startEditingConnection(connection.id)}
            >
              <Connection
                width={connection.width}
                id={connection.id}
                label={connection.label}
                from={getConceptCenter(connection.from)}
                to={getConceptCenter(connection.to)}
                onLabelChange={lableChangeWidthAdjustment}
              />
            </g>
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
