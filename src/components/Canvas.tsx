import { useState } from "react";
import Connection from "./Connection";
import Concept from "./Concept";

function Canvas() {
  const [concepts, setConcepts] = useState([
    { id: 1, label: "Concept 1", x: 600, y: 400 },
    { id: 2, label: "Concept 2", x: 900, y: 600 },
  ]);

  const [connections, setConnections] = useState([
    { id: 1, label: "Connection 1", from: 1, to: 2 },
  ]);

  const getConceptCenter = (conceptId: number) => {
    const concept = concepts.find((c) => c.id === conceptId);

    if (!concept) return { x: 0, y: 0 };

    return { x: concept.x + 50, y: concept.y + 25 };
  };

  return (
    <div className="w-screen h-screen bg-background">
      <div className="absolute top-10 left-10 px-4 py-3 bg-background shadow-lg rounded-sm">
        <h1 className="font-bold">Concept Mapping Tool</h1>
      </div>

      <svg className="w-full h-full">
        <defs>
          <pattern
            id="dot-pattern"
            x="0"
            y="0"
            width="20"
            height="20"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="2" cy="2" r="1" className="fill-muted-foreground" />
          </pattern>
        </defs>

        <rect className="w-full h-full fill-[url(#dot-pattern)]" />

        <g>
          {connections.map((connection) => (
            <Connection
              key={connection.id}
              label={connection.label}
              start={getConceptCenter(connection.from)}
              end={getConceptCenter(connection.to)}
            />
          ))}

          {concepts.map((concept) => (
            <Concept
              key={concept.id}
              label={concept.label}
              x={concept.x}
              y={concept.y}
            />
          ))}
        </g>
      </svg>
    </div>
  );
}

export default Canvas;
