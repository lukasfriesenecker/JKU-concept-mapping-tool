import { useEffect, useRef } from 'react'
import interact from 'interactjs'

function useScalable(
  id: number,
  initialScale: number,
  onScale: (id: number, newScale: number) => void
) {
  const ref = useRef<SVGRectElement | null>(null)
  const scaleRef = useRef(initialScale)
  const onScaleRef = useRef(onScale)

  useEffect(() => {
    if (!ref.current) return

    const interactable = interact(ref.current).resizable({
      edges: { left: true, right: true, top: true, bottom: true },
      listeners: {
        move(event) {
          const newScale = event.rect.width / 100 
          scaleRef.current = newScale
          onScaleRef.current(id, newScale)
        },
      },
    })

    return () => {
      interactable.unset()
    }
  }, [id])

  return ref
}

export default useScalable
