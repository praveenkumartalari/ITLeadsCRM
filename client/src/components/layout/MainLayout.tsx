import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { AppHeader } from './AppHeader';
import { AppSidebar } from './AppSidebar';

export const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const { logout } = useContext(AuthContext);

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <AppHeader />
      <div className="flex flex-1">
        <AppSidebar />
        <main className="flex-1 p-6 overflow-auto">
          {children}
          <button
            onClick={logout}
            className="mt-6 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition duration-300"
          >
            Logout
          </button>
        </main>
      </div>
    </div>
  );
};