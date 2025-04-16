
import { BellRing, MessageSquare, Search, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTheme } from "@/hooks/use-theme";

export function AppHeader() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="border-b bg-background py-3 px-6 sticky top-0 z-10">
      <div className="flex items-center justify-between">
        <div className="relative w-96">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search leads, tasks, etc..."
            className="pl-8"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={toggleTheme}
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </Button>
          <Button variant="ghost" size="icon">
            <BellRing size={20} />
          </Button>
          <Button variant="ghost" size="icon">
            <MessageSquare size={20} />
          </Button>
        </div>
      </div>
    </header>
  );
}
