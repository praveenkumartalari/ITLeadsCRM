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
      // Navigation is now handled by ProtectedRoute, but add a fallback
      if (!document.cookie.includes('auth_token')) {
        navigate('/login');
      }
    } catch (error) {
      toast.error("Logout failed");
      console.error("Error during logout:", error);
    }
  };

  if (loading) return null; // Hide sidebar until user data is loaded

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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            {!collapsed ? (
              <div className="flex items-center gap-3 animate-fadeIn cursor-pointer">
                <Avatar className="h-10 w-10 transition-all duration-300">
                  <AvatarImage src={`https://avatar.vercel.sh/${user?.email}`} />
                  <AvatarFallback>{user?.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="transition-opacity duration-300">
                  <p className="text-sm font-medium">{user?.username}</p>
                  <p className="text-xs text-gray-500">{user?.role}</p>
                </div>
              </div>
            ) : (
              <Avatar className="h-10 w-10 mx-auto transition-all duration-300 cursor-pointer">
                <AvatarImage src={`https://avatar.vercel.sh/${user?.email}`} />
                <AvatarFallback>{user?.username.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
            )}
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem className="cursor-pointer">
              <Link to="/profile" className="flex items-center w-full">
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600">
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}