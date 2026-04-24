import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const Layout = () => {
  return (
    <div className="min-h-screen gradient-bg transition-colors duration-500 flex flex-col md:flex-row">
      <Sidebar />
      <main className="flex-1 md:ml-20 lg:ml-64 pt-4 md:pt-10 pb-24 md:pb-12 px-4 transition-all overflow-x-hidden">
        <div className="max-w-4xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
