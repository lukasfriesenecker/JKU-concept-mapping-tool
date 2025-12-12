import { useEffect, useRef } from 'react'
import interact from 'interactjs'

function useScalable(
  id: number,
  initial: { x: number; y: number; width: number; height: number },
  onResize: (
    rect: { x: number; y: number; width: number; height: number }
  ) => void
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
          const target = event.target

          let x = parseFloat(target.getAttribute('data-x') || '0')
          let y = parseFloat(target.getAttribute('data-y') || '0')

          let width = event.rect.width
          let height = event.rect.height

          x += event.deltaRect.left
          y += event.deltaRect.top

    
          target.setAttribute('width', String(width))
          target.setAttribute('height', String(height))

      

         onResize({ x, y, width, height })
        },
      },
    })

    return () => interactable.unset()
  }, [id])

  return ref
}

export default useScalable
