import { useState } from 'react'
import Keyboard from 'react-simple-keyboard'
import 'react-simple-keyboard/build/css/index.css'
import { useTheme } from '../ThemeProvider'
import type { IConnection } from '../interfaces/Connection'

interface IProps {
  connection: IConnection
  viewport: { x: number; y: number; scale: number }
  onChange: (id: number, value: string, type: string) => void
  onEnter: (id: number, type: string) => void
  from: {
    x: number
    y: number
  }
  to: {
    x: number
    y: number
  }
}

function KeyboardWrapper({
  connection,
  viewport,
  onChange,
  onEnter,
  from,
  to,
}: IProps) {
  const [layoutName, setLayoutName] = useState('default')
  const { theme } = useTheme()
  const keyboardTheme =
    theme === 'dark' ? 'hg-theme-default dark' : 'hg-theme-default light'

  const screenX = ((from.x + to.x) / 2) * viewport.scale + viewport.x
  const screenY = ((from.y + to.y) / 2) * viewport.scale + viewport.y

  const height = 30 * viewport.scale

  const onKeyPress = (button: string) => {
    if (button === '{shift}' || button === '{lock}') {
      setLayoutName(layoutName === 'default' ? 'shift' : 'default')
    }

    if (button === '{enter}') {
      onEnter(connection.id, 'connection')
    }
  }

  return (
    <div
      className="bg-card animate-in fade-in zoom-in-95 absolute z-50 flex items-center gap-2 rounded-lg border p-1 shadow-xl duration-150"
      style={{
        left: `${screenX - 45}px`,
        top: `${screenY + height - 5}px`,
      }}
    >
      <Keyboard
        layoutName={layoutName}
        onChange={(value) => onChange(connection.id, value, 'connection')}
        onKeyPress={onKeyPress}
        onInit={(keyboard) => keyboard.setInput(connection.label)}
        theme={keyboardTheme}
        display={{
          '{bksp}': '⌫',
          '{enter}': 'Submit',
          '{shift}': '⇧',
          '{space}': '␣',
        }}
      />
    </div>
  )
}

export default KeyboardWrapper
