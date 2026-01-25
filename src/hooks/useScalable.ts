import { useEffect, useRef } from 'react'
import interact from 'interactjs'

function useScalable(
  id: number,
  onScale: (
    id: number,
    dx: number,
    dy: number,
    width: string,
    height: string
  ) => void,
  isResizable: boolean
) {
  const ref = useRef<SVGRectElement | null>(null)
  const onScaleRef = useRef(onScale)
  onScaleRef.current = onScale

  useEffect(() => {
    if (!ref.current) return
    if (!isResizable) return

    const el = ref.current

    const interactable = interact(el).resizable({
      edges: { left: true, right: true, top: true, bottom: true },
      modifiers: [
        interact.modifiers.restrictSize({
          min: { width: 100, height: 50 },
        }),
      ],
      listeners: {
        move(event) {
          const target = event.target

          let x = parseFloat(target.getAttribute('x')) || 0
          let y = parseFloat(target.getAttribute('y')) || 0

          const width = event.rect.width
          const height = event.rect.height

          x += event.deltaRect.left
          y += event.deltaRect.top

          onScaleRef.current(id, x, y, width, height)
        },
      },
    })

    return () => interactable.unset()
  }, [id, isResizable])

  return ref
}

export default useScalable
