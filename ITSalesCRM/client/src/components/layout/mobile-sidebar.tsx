import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";
import {
  Menu,
  X,
  LineChart,
  UserSearch,
  Building2,
  CalendarCheck,
  FileText,
  Users,
  Settings,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
}

function NavItem({ href, icon, children, active, onClick }: NavItemProps) {
  return (
    <Link href={href}>
      <a
        className={cn(
          "flex items-center px-3 py-2 text-sm font-medium rounded-md",
          active
            ? "text-white bg-primary"
            : "text-slate-700 hover:text-primary hover:bg-slate-100"
        )}
        onClick={onClick}
      >
        <span className="mr-3 text-lg">{icon}</span>
        {children}
      </a>
    </Link>
  );
}

export default function MobileSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();
  const { user, logout, isAdmin, isManager } = useAuth();

  const getInitials = (name: string = "User") => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const closeSidebar = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    // Close sidebar when location changes
    closeSidebar();
  }, [location]);

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden p-2 text-slate-500 hover:text-slate-700"
        onClick={toggleSidebar}
      >
        <Menu className="h-6 w-6" />
      </Button>

      {/* Mobile Menu Overlay */}
      <div
        className={cn(
          "md:hidden fixed inset-0 z-20 bg-black bg-opacity-50 transition-opacity",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={closeSidebar}
      />

      {/* Mobile Sidebar */}
      <div
        className={cn(
          "md:hidden fixed inset-y-0 left-0 z-30 w-64 bg-white transform transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-slate-200">
          <div className="flex items-center">
            <div className="flex items-center justify-center w-8 h-8 rounded-md bg-primary text-white mr-2">
              <LineChart className="w-5 h-5" />
            </div>
            <span className="text-xl font-semibold text-slate-800">
              SmartLead
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="p-2 text-slate-500 hover:text-slate-700"
            onClick={closeSidebar}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 overflow-y-auto">
          <div className="px-2 py-4 space-y-1">
            <NavItem
              href="/"
              icon={<LineChart />}
              active={location === "/"}
              onClick={closeSidebar}
            >
              Dashboard
            </NavItem>
            <NavItem
              href="/leads"
              icon={<UserSearch />}
              active={location.startsWith("/leads")}
              onClick={closeSidebar}
            >
              Leads
            </NavItem>
            <NavItem
              href="/clients"
              icon={<Building2 />}
              active={location.startsWith("/clients")}
              onClick={closeSidebar}
            >
              Clients
            </NavItem>
            <NavItem
              href="/activities"
              icon={<CalendarCheck />}
              active={location.startsWith("/activities")}
              onClick={closeSidebar}
            >
              Activities
            </NavItem>
            <NavItem
              href="/reports"
              icon={<FileText />}
              active={location.startsWith("/reports")}
              onClick={closeSidebar}
            >
              Reports
            </NavItem>
            
            {isAdmin && (
              <NavItem
                href="/users"
                icon={<Users />}
                active={location.startsWith("/users")}
                onClick={closeSidebar}
              >
                Users
              </NavItem>
            )}
            
            {(isAdmin || isManager) && (
              <NavItem
                href="/settings"
                icon={<Settings />}
                active={location.startsWith("/settings")}
                onClick={closeSidebar}
              >
                Settings
              </NavItem>
            )}
          </div>
        </nav>

        {/* User Profile */}
        <div className="flex items-center p-4 border-t border-slate-200">
          <Avatar className="w-8 h-8">
            <AvatarFallback className="bg-primary/10 text-primary">
              {getInitials(user?.username)}
            </AvatarFallback>
          </Avatar>
          <div className="ml-3">
            <p className="text-sm font-medium text-slate-800">
              {user?.username || "User"}
            </p>
            <p className="text-xs text-slate-500">
              {user?.role === "admin"
                ? "Admin"
                : user?.role === "manager"
                ? "Manager"
                : "Sales Rep"}
            </p>
          </div>
          <div className="ml-auto">
            <Button
              variant="ghost"
              size="icon"
              className="p-1 text-slate-500 hover:text-slate-700"
              onClick={logout}
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
