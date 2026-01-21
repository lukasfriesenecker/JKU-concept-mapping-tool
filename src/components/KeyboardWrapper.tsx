import { useState } from "react";
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";

interface IProps {
  concept: any
  viewport: { x: number; y: number; scale: number }
  onChange: (id: number, value: string) => void
  onEnter: (id: number) => void

}

function KeyboardWrapper({ concept, viewport, onChange, onEnter }: IProps) {
  const [layoutName, setLayoutName] = useState("default");

  const screenX = concept.x * viewport.scale + viewport.x
  const screenY = concept.y * viewport.scale + viewport.y

  const conceptWidth = parseFloat(concept.width) * viewport.scale

  const onKeyPress = (button: string) => {
    if (button === "{shift}" || button === "{lock}") {
      setLayoutName(layoutName === "default" ? "shift" : "default");
    }

    if (button === "{enter}") {
      onEnter(concept.id);
    }
  };


  return (
    <div
      className="bg-card animate-in fade-in zoom-in-95 absolute z-50 flex items-center gap-2 rounded-lg border p-1 shadow-xl duration-150"
      style={{
        left: `${screenX + conceptWidth + 10}px`,
        top: `${screenY}px`,
      }}
    >
      <Keyboard
        layoutName={layoutName}
        onChange={(value) => onChange(concept.id, value)} onKeyPress={onKeyPress}
        onInit={(keyboard) => keyboard.setInput(concept.label)}
      />
    </div>
  );
}

export default KeyboardWrapper;
