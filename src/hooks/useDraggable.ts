import interact from 'interactjs'
import { useEffect, useRef } from 'react'

function useDraggable(
  id: number,
  onDrag: (id: number, dx: number, dy: number) => void
) {
  const ref = useRef(null)

  const onDragRef = useRef(onDrag)
  onDragRef.current = onDrag

  useEffect(() => {
    if (!ref.current) return

    const interactable = interact(ref.current).draggable({
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

  return ref
}

export default useDraggable
