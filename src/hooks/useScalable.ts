import { useEffect, useRef } from 'react'
import interact from 'interactjs'

function useScalable(
  id: number,
  initial: { x: number; y: number; width: number; height: number },
  onResize: (rect: {
    x: number
    y: number
    width: number
    height: number
  }) => void
) {
  const ref = useRef<SVGRectElement | null>(null)

  useEffect(() => {
    if (!ref.current) return

    const el = ref.current

    el.setAttribute('data-x', String(initial.x))
    el.setAttribute('data-y', String(initial.y))

    const interactable = interact(el).resizable({
      edges: { left: true, right: true, top: true, bottom: true },
      modifiers: [
        interact.modifiers.restrictSize({
          min: { width: 100, height: 50 },
        }),
      ],
      listeners: {
        move(event) {

          let width = event.rect.width
          let height = event.rect.height

          onResize({ x:0,y: 0, width, height })
        },
      },
    })

    return () => interactable.unset()
  }, [id])

  return ref
}

export default useScalable
