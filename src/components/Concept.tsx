import { memo, useEffect, useRef, useState } from 'react'
import useDraggable from '../hooks/useDraggable'
import useScalable from '../hooks/useScalable'

interface ConceptProps {
  id: number
  label: string
  x: number
  y: number
  width: string
  height: string
  scale: number
  onDrag: (id: number, dx: number, dy: number) => void
  onScale: (
    id: number,
    dx: number,
    dy: number,
    width: string,
    height: string
  ) => void
  onSelect: (id: number) => void
  onLabelChange: (id: number, value: string) => void;
  editing: boolean;
  onStopEditing: () => void;
  onInput: (id: number, value: string) => void;
  isSelected: boolean
}

function Concept({
  id,
  label,
  x,
  y,
  width,
  height,
  scale,
  onDrag,
  onScale,
  onSelect,
  editing,
  onStopEditing,
  onLabelChange,
  isSelected,
  onInput
}: ConceptProps) {
  const dragRef = useDraggable(id, scale, onDrag)
  const scaleRef = useScalable(id, onScale, isSelected)
  const [labelValue, setLabel] = useState(label);
  const inputRef = useRef<HTMLInputElement>(null);


  const handleRadius = 6 / scale
  useEffect(() => {
    if (editing && inputRef.current) {

      inputRef.current.focus();
    }
  }, [editing]);

  const handleInput = () => {
    if (!inputRef.current) return;

    const textWidth = inputRef.current.scrollWidth;
    console.log(textWidth);

    onInput(id, textWidth.toString());
  };

  return (
    <>
      <g
        ref={dragRef}
        transform={`translate(${x}, ${y})`}
        onClick={(e) => {
          e.stopPropagation()
          onSelect(id)
        }}
        onDoubleClick={(e) => e.stopPropagation()}
      >
        <rect

          ref={scaleRef}
          width={width}
          height={height}
          rx="4"
          className={`fill-card cursor-pointer transition-colors ${isSelected ? 'stroke-primary stroke-1' : 'stroke-border stroke-1'
            }`}
        />

        {isSelected && (
          <g className="pointer-events-none">
            <circle cx="0" cy="0" r={handleRadius} className="fill-ring" />
            <circle cx={width} cy="0" r={handleRadius} className="fill-ring" />
            <circle cx="0" cy={height} r={handleRadius} className="fill-ring" />
            <circle
              cx={width}
              cy={height}
              r={handleRadius}
              className="fill-ring"
            />
          </g>
        )}

        <circle cx={15} cy={25} r={8} className="fill-ring" />
        {!editing && (
          <text
            x={30}
            y={30}
            className="fill-card-foreground text-sm font-medium select-none"
          >
            {label}
          </text>
        )}
      </g>
      {editing && (
        <g transform={`translate(${x}, ${y})`}>
          <foreignObject
            x={0}
            y={0}
            width={width}
            height={height}
          >
            <input
              ref={inputRef}
              style={{
                paddingLeft: '30px',
                paddingRight: '5px'
              }}
              value={labelValue}
              onChange={e => setLabel(e.target.value)}
              onInput={() => {
                handleInput()
              }}
              onBlur={() => {
                onStopEditing();
                onLabelChange(id, labelValue)
              }}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  onStopEditing();
                  onLabelChange(id, labelValue)
                }
              }}
              className="w-full h-full text-sm font-medium bg-transparent outline-none"
            />
          </foreignObject>
        </g>
      )}
    </>
  )
}

export default memo(Concept)
