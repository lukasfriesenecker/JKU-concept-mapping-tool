import interact from 'interactjs'
import { useEffect, useRef, useState } from 'react'

const MIN_SCALE = 0.1
const MAX_SCALE = 5
const SCALE_SENSITIVITY = 2

function usePanZoom() {
  const ref = useRef<SVGSVGElement>(null)

  const [viewport, setViewport] = useState({ x: 0, y: 0, scale: 1 })

  const viewportRef = useRef(viewport)
  viewportRef.current = viewport

  useEffect(() => {
    const svgElement = ref.current
    if (!svgElement) return

    const interactable = interact(svgElement)
      .draggable({
        listeners: {
          move(event) {
            setViewport((prev) => ({
              ...prev,
              x: prev.x + event.dx,
              y: prev.y + event.dy,
            }))
          },
        },
      })
      .gesturable({
        listeners: {
          move(event) {
            const current = viewportRef.current

            let newScale = current.scale * (1 + event.ds * SCALE_SENSITIVITY)
            newScale = Math.min(Math.max(newScale, MIN_SCALE), MAX_SCALE)

            const scaleRatio = newScale / current.scale

            const svgElementPosition = svgElement.getBoundingClientRect()
            const localX = event.client.x - svgElementPosition.left
            const localY = event.client.y - svgElementPosition.top

            const newX = localX - (localX - current.x) * scaleRatio
            const newY = localY - (localY - current.y) * scaleRatio

            setViewport({ x: newX, y: newY, scale: newScale })
          },
        },
      })

    return () => {
      interactable.unset()
    }
  }, [])

  return { ref, viewport }
}

export default usePanZoom
