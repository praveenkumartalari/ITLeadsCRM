import { ReactNode, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/lib/auth";
import Sidebar from "./sidebar";
import Header from "./header";

interface LayoutProps {
  children: ReactNode;
  title?: string;
}

export default function Layout({ children, title = "SmartLead CRM" }: LayoutProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const [location, navigate] = useLocation();

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isLoading && !isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-sm text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect to login
  }

  return (
    <div className="h-screen flex overflow-hidden bg-slate-50">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title={title} />

        <main className="flex-1 overflow-y-auto p-4 bg-slate-50">
          {children}
        </main>
      </div>
    </div>
  );
}
