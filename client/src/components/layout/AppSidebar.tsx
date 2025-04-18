import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { toast } from "sonner";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

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
  const [user, setUser] = useState<{ id: string; username: string; email: string; role: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/auth/me", {
          credentials: "include",
        });
        const data = await response.json();
        if (response.ok) {
          setUser(data.data.user);
        } else {
          toast.error(data.message || "Failed to load user details");
        }
      } catch (error) {
        toast.error("Failed to load user details");
        console.error("Error fetching current user:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCurrentUser();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      if (!document.cookie.includes('auth_token')) {
        navigate('/login');
      }
    } catch (error) {
      toast.error("Logout failed");
      console.error("Error during logout:", error);
    }
  };

  if (loading) return null;

  return (
    <div
      className={cn(
        "h-[calc(100vh-57px)] border-r bg-orange-500 flex flex-col transition-all duration-300 ease-in-out",
        collapsed ? "w-16" : "w-64"
      )}
      aria-label="Main navigation sidebar"
    >
      <div className="p-4 flex items-center justify-between flex-shrink-0">
        {!collapsed && (
          <div className="flex items-center gap-2 animate-fadeIn">
            <div className="flex flex-col">
              <h1 className="text-white font-bold text-xl tracking-tight">
                Smart<span className="text-brand-100">Lead</span>
              </h1>
              <div className="h-0.5 w-full bg-gradient-to-r from-white to-transparent rounded-full"></div>
            </div>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed((prev) => !prev)}
          className={cn(
            "h-8 w-8 rounded-full hover:bg-orange-600 text-white transition-all duration-300",
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

      <div className="flex-1 px-3 py-2 overflow-y-auto flex flex-col justify-between">
        <nav className="space-y-1 flex-shrink-0">
          {navItems.map((item) => (
            <HoverCard key={item.href} openDelay={200} closeDelay={100}>
              <HoverCardTrigger asChild>
                <Link
                  to={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 relative group hover:shadow-sm",
                    location.pathname === item.href
                      ? "bg-orange-400 text-white"
                      : "text-white hover:bg-orange-600"
                  )}
                  aria-label={item.title}
                >
                  <item.icon size={20} className="transition-transform duration-200 group-hover:text-orange-100" />
                  {!collapsed && <span className="transition-opacity duration-200">{item.title}</span>}
                </Link>
              </HoverCardTrigger>
              {collapsed && (
                <HoverCardContent
                  side="right"
                  align="center"
                  sideOffset={8}
                  className="p-2 bg-gray-800 text-white text-xs rounded-md shadow-md max-w-xs break-words z-[1000]"
                >
                  {item.title}
                </HoverCardContent>
              )}
            </HoverCard>
          ))}
        </nav>
      </div>

      <Separator className="my-2 bg-white/80 h-[2px] flex-shrink-0" />

      <div className="p-4 flex-shrink-0">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            {!collapsed ? (
              <div className="flex items-center gap-3 animate-fadeIn cursor-pointer">
                <Avatar className="h-10 w-10 transition-all duration-300">
                  <AvatarImage src={`https://avatar.vercel.sh/${user?.email}`} />
                  <AvatarFallback>{user?.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="transition-opacity duration-300">
                  <p className="text-sm font-medium text-white">{user?.username}</p>
                  <p className="text-xs text-gray-200">{user?.role}</p>
                </div>
              </div>
            ) : (
              <Avatar className="h-10 w-10 mx-auto transition-all duration-300 cursor-pointer">
                <AvatarImage src={`https://avatar.vercel.sh/${user?.email}`} />
                <AvatarFallback>{user?.username.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
            )}
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-gray-800 text-white">
            <DropdownMenuItem className="cursor-pointer hover:bg-orange-600">
              <Link to="/profile" className="flex items-center w-full">
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-400 hover:bg-orange-600">
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}