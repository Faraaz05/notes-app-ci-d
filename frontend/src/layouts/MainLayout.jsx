import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-[#0f0f0f] flex flex-col">
      <Header />
      
      {/* Main Content */}
      <main className="flex-1 pt-16">
        <Outlet />
      </main>
      
      <Footer />
    </div>
  );
};

export default MainLayout;
