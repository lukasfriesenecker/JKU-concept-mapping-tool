import {
  Download,
  File,
  FolderOpen,
  FolderPlus,
  Menu,
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { useState } from 'react'

interface ToolbarProps {
  title: string
  description: string
  onSave: () => void
  onSaveAs: () => void
  onSaveProjectInfo: (title: string, desc: string) => void
}

function Toolbar({ onSave, onSaveAs, onSaveProjectInfo, title: initialTitle,
  description: initialDescription }: ToolbarProps) {
  const { theme, setTheme } = useTheme()
  const [title, setTitle] = useState(initialTitle)
  const [description, setDescription] = useState(initialDescription)
  const [popoverOpen, setPopoverOpen] = useState(false)


  return (
    <div className="bg-card absolute left-1/2 flex w-full -translate-x-1/2 justify-between border p-2 shadow-2xl md:rounded-sm lg:top-4 lg:w-4xl">
      <div className="flex h-9 w-1/4 flex-row gap-2">
        <Menubar>
          <MenubarMenu>
            <MenubarTrigger>
              <Button variant="ghost" className="hidden md:flex">
                Datei
              </Button>
              <Button variant="ghost" size="icon" className="flex md:hidden">
                <Menu className="text-card-foreground size-6" />
              </Button>
            </MenubarTrigger>
            <MenubarContent>
              <MenubarItem>
                <File className="text-card-foreground size-4" />
                Neues Projekt
              </MenubarItem>
              <MenubarItem>
                <FolderOpen className="text-card-foreground size-4" />
                Projekt öffnen
              </MenubarItem>
              <MenubarItem onClick={onSave}>
                <Save className="text-card-foreground size-4" />
                Speichern
              </MenubarItem>
              <MenubarItem onClick={onSaveAs}>
                <FolderPlus className="text-card-foreground size-4" />
                Speichern unter
              </MenubarItem>
              <MenubarSub>
                <MenubarSubTrigger className="hidden md:flex">
                  <Download className="text-card-foreground size-4" />
                  Exportieren
                </MenubarSubTrigger>
                <MenubarSubContent>
                  <MenubarItem>PDF</MenubarItem>
                  <MenubarItem>JPG</MenubarItem>
                  <MenubarItem>PNG</MenubarItem>
                </MenubarSubContent>
              </MenubarSub>
              <Accordion type="single" className="flex md:hidden" collapsible>
                <AccordionItem value="item-1">
                  <AccordionTrigger>
                    <div className="flex gap-2">
                      <Download className="text-card-foreground size-4" />
                      Exportieren
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <MenubarItem>PDF</MenubarItem>
                    <MenubarItem>JPG</MenubarItem>
                    <MenubarItem>PNG</MenubarItem>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
        <Separator orientation="vertical" className="hidden md:flex" />
        <Button
          variant="ghost"
          size="icon"
          className="hidden md:flex"
          onClick={onSave}
        >
          <Save className="text-card-foreground size-6" />
        </Button>
      </div>

      <div className="flex w-1/2 justify-center">
        <Popover open={popoverOpen} onOpenChange={(open) => {
          if (!open) {
            setTitle(initialTitle)
            setDescription(initialDescription)
          }
          setPopoverOpen(open)
        }}>
          <PopoverTrigger>
            <Button variant="ghost">
              {title.length > 20 ? title.slice(0, 20) + '…' : title}
              <Separator orientation="vertical" className="hidden md:flex" />
              {description.length > 40 ? description.slice(0, 40) + '…' : description}
            </Button>
          </PopoverTrigger>

          <PopoverContent className="flex flex-col gap-6 md:w-xl">
            <div className="grid w-full items-center gap-3">
              <Label htmlFor="title">Titel</Label>
              <Input type="text"
                id="title"
                placeholder="Titel"
                value={title}
                onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div className="grid w-full gap-3">
              <Label htmlFor="description">Beschreibung</Label>
              <Textarea id="description"
                placeholder="Beschreibung"
                value={description}
                onChange={(e) => setDescription(e.target.value)} />
            </div>
            <div className="flex flex-col justify-end gap-4 md:flex-row md:gap-2">
              <Button onClick={() => {
                setTitle(initialTitle)
                setDescription(initialDescription)
                setPopoverOpen(false)
              }} variant="secondary">Abbrechen</Button>
              <Button
                onClick={() => {
                  onSaveProjectInfo(title, description)
                  setPopoverOpen(false);
                }}
              >
                Speichern
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex w-1/4 justify-end gap-2">
        <div className="hidden items-center px-1 font-medium md:flex">75 %</div>
        <Separator orientation="vertical" className="hidden md:flex" />
        <Button
          variant="ghost"
          size="icon"
          className="hidden md:flex"
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
        <Separator orientation="vertical" className="hidden md:flex" />
        <Popover>
          <PopoverTrigger>
            <Button variant="ghost" size="icon">
              <SlidersVertical className="text-card-foreground size-6" />
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="md:w-72">
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
              <h4 className="flex md:hidden">Anzeigemodus</h4>

              <Button
                variant="ghost"
                size="icon"
                className="flex md:hidden"
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
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}

export default Toolbar
