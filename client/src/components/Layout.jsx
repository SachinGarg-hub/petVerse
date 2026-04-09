import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const Layout = () => {
  return (
    <div className="min-h-screen gradient-bg transition-colors duration-500">
      <Navbar />
      <main className="max-w-6xl mx-auto pt-4 md:pt-24 pb-24 md:pb-12 px-4">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
