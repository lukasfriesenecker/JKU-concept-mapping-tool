import interact from 'interactjs'
import { useEffect, useRef, useState } from 'react'

function usePanZoom() {
  const ref = useRef(null)

  const [viewport, setViewport] = useState({ x: 0, y: 0, scale: 1 })

  useEffect(() => {
    if (!ref.current) return

    const interactable = interact(ref.current).draggable({
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

    return () => {
      interactable.unset()
    }
  }, [])

  return { ref, viewport }
}

export default usePanZoom
