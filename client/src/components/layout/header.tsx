import { useLocation } from "wouter";
import { Search, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import MobileSidebar from "./mobile-sidebar";

interface HeaderProps {
  title: string;
}

export default function Header({ title }: HeaderProps) {
  const [location] = useLocation();

  const getPageTitle = () => {
    if (location === "/") return "Dashboard";
    if (location.startsWith("/leads")) {
      if (location === "/leads/new") return "Add New Lead";
      if (location.match(/^\/leads\/\d+$/)) return "Edit Lead";
      return "Leads";
    }
    if (location.startsWith("/clients")) {
      if (location === "/clients/new") return "Add New Client";
      if (location.match(/^\/clients\/\d+$/)) return "Edit Client";
      return "Clients";
    }
    if (location.startsWith("/activities")) {
      if (location === "/activities/new") return "Add New Activity";
      if (location.match(/^\/activities\/\d+$/)) return "Edit Activity";
      return "Activities";
    }
    if (location.startsWith("/reports")) return "Reports";
    if (location.startsWith("/users")) return "Users";
    if (location.startsWith("/settings")) return "Settings";
    
    return title;
  };

  return (
    <header className="bg-white shadow-sm z-10">
      <div className="flex items-center justify-between h-16 px-4">
        {/* Mobile menu button */}
        <MobileSidebar />
        
        {/* Page title */}
        <h1 className="text-lg font-semibold text-slate-800">{getPageTitle()}</h1>
        
        {/* Right side icons */}
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            className="ml-4 p-2 rounded-full text-slate-500 hover:text-slate-700 hover:bg-slate-100"
          >
            <Bell className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="ml-2 p-2 rounded-full text-slate-500 hover:text-slate-700 hover:bg-slate-100"
          >
            <Search className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
