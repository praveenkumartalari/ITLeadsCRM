import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { AppHeader } from './AppHeader';
import { AppSidebar } from './AppSidebar';

export const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const { logout } = useContext(AuthContext);

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <AppHeader />
      <div className="flex flex-1 overflow-hidden">
        <AppSidebar />
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};