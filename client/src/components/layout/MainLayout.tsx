import { useContext, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { AppHeader } from './AppHeader';
import { AppSidebar } from './AppSidebar';

export const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const { logout } = useContext(AuthContext);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <AppHeader />
      <div className="flex flex-1 overflow-hidden">
        <AppSidebar onToggleCollapse={setSidebarCollapsed} />
        <main
          className={`flex-1 p-6 overflow-auto transition-all duration-300 ease-in-out ${
            sidebarCollapsed ? 'ml-16' : 'ml-64'
          }`}
        >
          {children}
        </main>
      </div>
    </div>
  );
};