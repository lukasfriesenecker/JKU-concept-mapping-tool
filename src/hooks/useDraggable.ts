import interact from 'interactjs'
import { useEffect, useRef } from 'react'

function useDraggable(
  id: number,
  onDrag: (id: number, dx: number, dy: number) => void
) {
  const draggableRef = useRef(null)

  const onDragRef = useRef(onDrag)
  onDragRef.current = onDrag

  useEffect(() => {
    if (!draggableRef.current) return

    const interactable = interact(draggableRef.current).draggable({
      listeners: {
        move(event) {
          onDragRef.current(id, event.dx, event.dy)
        },
      },
    })

    return () => {
      interactable.unset()
    }
  }, [id])

  return draggableRef
}

export default useDraggable
