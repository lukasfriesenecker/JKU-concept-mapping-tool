import Canvas from './components/Canvas'
import { ThemeProvider } from '@/components/ThemeProvider'

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Canvas />
    </ThemeProvider>
  )
}

export default App
