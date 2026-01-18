import { Palette, Pencil, Trash2, X } from 'lucide-react'
import { Button } from './ui/button'

interface ConceptMenuProps {
  concept: any
  viewport: { x: number; y: number; scale: number }
  onDeselect: (id: number) => void
}

function ConceptMenu({ concept, viewport, onDeselect }: ConceptMenuProps) {
  const screenX = concept.x * viewport.scale + viewport.x
  const screenY = concept.y * viewport.scale + viewport.y

  const conceptWidth = parseFloat(concept.width) * viewport.scale

  return (
    <div
      className="bg-card animate-in fade-in zoom-in-95 absolute z-50 flex items-center gap-2 rounded-lg border p-1 shadow-xl duration-150"
      style={{
        left: `${screenX + conceptWidth + 10}px`,
        top: `${screenY}px`,
      }}
    >
      <div className="flex flex-col">
        <Button variant="ghost" className="flex justify-start gap-4">
          <Pencil />
          Rename
        </Button>
        <Button variant="ghost" className="flex justify-start gap-4">
          <Trash2 />
          Delete
        </Button>
        <Button variant="ghost" className="flex justify-start gap-4">
          <Palette />
          Change Color
        </Button>
        <Button
          variant="ghost"
          className="flex justify-start gap-4"
          onClick={() => onDeselect(concept.id)}
        >
          <X />
          Cancel
        </Button>
      </div>
    </div>
  )
}

export default ConceptMenu
