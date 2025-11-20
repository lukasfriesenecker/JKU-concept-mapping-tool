interface ConceptProps {
  label: string
  x: number
  y: number
}

function Concept({ label, x, y }: ConceptProps) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width="100"
        height="50"
        rx="8"
        className="fill-concept-background stroke-concept-border stroke-2"
      />

      <text
        x={x + 50}
        y={y + 30}
        textAnchor="middle"
        className="text-sm font-medium"
      >
        {label}
      </text>
    </g>
  )
}

export default Concept
