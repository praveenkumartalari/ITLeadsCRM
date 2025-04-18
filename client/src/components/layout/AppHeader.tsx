import { BellRing, MessageSquare, Search, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTheme } from "@/hooks/use-theme";

export function AppHeader() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="border-b bg-background py-3 px-6 sticky top-0 z-20"> {/* Changed z-10 to z-20 */}
      <div className="flex items-center justify-between">
        <div className="relative w-96">
          <img
            src="https://calibrage.in/assets/images/calibrage-logo.png"
            alt="Logo"
            className="h-10 w-auto object-contain"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
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