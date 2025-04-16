import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Calendar,
  BarChart3,
  Settings,
  Mail,
  CheckSquare,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import MainLogo from "@/assets/Logos/Calibrage_MainLogo.png";
import Logo from "@/assets/Logos/Calibrage_Logo.png";
const navItems = [
  { title: "Dashboard", href: "/", icon: LayoutDashboard },
  { title: "Leads", href: "/leads", icon: Users },
  { title: "Tasks", href: "/tasks", icon: CheckSquare },
  { title: "Calendar", href: "/calendar", icon: Calendar },
  { title: "Campaigns", href: "/campaigns", icon: Mail },
  { title: "Analytics", href: "/analytics", icon: BarChart3 },
  { title: "Settings", href: "/settings", icon: Settings },
];

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <div
      className={cn(
        "min-h-screen border-r bg-white flex flex-col transition-all duration-300 ease-in-out",
        collapsed ? "w-16" : "w-44"
      )}
      aria-label="Main navigation sidebar"
    >
      <div className="p-4 flex items-center justify-between">
        {!collapsed && (
          <div className="flex items-center gap-2 animate-fadeIn">
            <img
              src={MainLogo}
              alt="Calibrage Main Logo"
              className="h-12 w-auto object-contain transition-all duration-300 md:h-14 lg:h-16"
              loading="lazy"
            />
          </div>
        )}
        {collapsed && (
          <img
            src={Logo}
            alt="Calibrage Logo"
            className="h-6 w-auto object-contain mx-auto transition-all duration-300 md:h-7 lg:h-8"
            loading="lazy"
          />
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed((prev) => !prev)}
          className={cn(
            "h-8 w-8 rounded-full hover:bg-gray-200 transition-all duration-300",
            collapsed && "mx-auto"
          )}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRight size={16} className="transition-transform duration-300" />
          ) : (
            <ChevronLeft size={16} className="transition-transform duration-300" />
          )}
        </Button>
      </div>

      <div className="flex-1 px-3 py-4 overflow-y-auto">
        <nav className="space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 relative group hover:shadow-sm",
                location.pathname === item.href
                  ? "bg-brand-purple-light text-brand-purple"
                  : "text-gray-600 hover:bg-gray-100"
              )}
              aria-label={item.title}
            >
              <item.icon size={20} className="transition-transform duration-200" />
              {!collapsed && <span className="transition-opacity duration-200">{item.title}</span>}
              {collapsed && (
                <span className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap shadow-md"
                      style={{ top: '50%', transform: 'translateY(-50%)' }}>
                  {item.title}
                </span>
              )}
            </Link>
          ))}
        </nav>
      </div>

      <Separator className="my-2" />

      <div className="p-4">
        {!collapsed ? (
          <div className="flex items-center gap-3 animate-fadeIn">
            <Avatar className="h-10 w-10 transition-all duration-300">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div className="transition-opacity duration-300">
              <p className="text-sm font-medium">John Doe</p>
              <p className="text-xs text-gray-500">Sales Manager</p>
            </div>
          </div>
        ) : (
          <Avatar className="h-10 w-10 mx-auto transition-all duration-300">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
        )}
      </div>
    </div>
  );
}