import {
  Download,
  File,
  FolderOpen,
  FolderPlus,
  Moon,
  Save,
  SlidersVertical,
  Sun,
} from 'lucide-react'
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from '@/components/ui/menubar'
import { Separator } from '@/components/ui/separator'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { useTheme } from './ThemeProvider'

function Toolbar() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="bg-card absolute top-4 left-1/2 flex w-full max-w-4xl -translate-x-1/2 justify-between rounded-sm border p-2 shadow-2xl">
      <div className="flex h-9 flex-row gap-2">
        <Menubar>
          <MenubarMenu>
            <MenubarTrigger>Datei</MenubarTrigger>
            <MenubarContent>
              <MenubarItem>
                <File className="text-card-foreground size-4" />
                Neues Projekt
              </MenubarItem>
              <MenubarItem>
                <FolderOpen className="text-card-foreground size-4" />
                Projekt öffnen
              </MenubarItem>
              <MenubarItem>
                <Save className="text-card-foreground size-4" />
                Speichern
              </MenubarItem>
              <MenubarItem>
                <FolderPlus className="text-card-foreground size-4" />
                Speichern unter
              </MenubarItem>
              <MenubarSub>
                <MenubarSubTrigger>
                  <Download className="text-card-foreground size-4" />
                  Exportieren
                </MenubarSubTrigger>
                <MenubarSubContent>
                  <MenubarItem>PDF</MenubarItem>
                  <MenubarItem>JPG</MenubarItem>
                  <MenubarItem>PNG</MenubarItem>
                </MenubarSubContent>
              </MenubarSub>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
        <Separator orientation="vertical" />
        <Button variant="ghost" size="icon">
          <Save className="text-card-foreground size-6" />
        </Button>
      </div>

      <div>
        <Popover>
          <PopoverTrigger>
            <Button variant="ghost">
              <p>Obst - Concep Map</p>
              <Separator orientation="vertical" />
              <p>Concept Map über Obst</p>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="flex w-lg flex-col gap-6">
            <div className="grid w-full max-w-sm items-center gap-3">
              <Label htmlFor="title">Titel</Label>
              <Input type="text" id="title" placeholder="Titel" />
            </div>
            <div className="grid w-full gap-3">
              <Label htmlFor="description">Beschreibung</Label>
              <Textarea placeholder="Beschreibung" id="description" />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="secondary">Abbrechen</Button>
              <Button>Speichern</Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex gap-2">
        <div className="flex items-center px-1 font-medium">75 %</div>
        <Separator orientation="vertical" />
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            if (theme === 'light') {
              setTheme('dark')
            } else {
              setTheme('light')
            }
          }}
        >
          <Sun className="text-card-foreground size-6 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
          <Moon className="text-card-foreground absolute size-6 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
        </Button>
        <Separator orientation="vertical" />
        <Popover>
          <PopoverTrigger>
            <Button variant="ghost" size="icon">
              <SlidersVertical className="text-card-foreground size-6" />
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end">
            <div className="flex flex-col gap-4">
              <h4>Einstellungen</h4>
              <div className="flex items-center gap-3">
                <Checkbox id="keyboard" />
                <Label htmlFor="keyboard">Integrierte Tastatur anzeigen</Label>
              </div>
              <div className="flex items-center gap-3">
                <Checkbox id="edit" />
                <Label htmlFor="edit">Bearbeitung sperren</Label>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}

export default Toolbar
