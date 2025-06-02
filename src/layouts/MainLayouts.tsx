// src/layouts/MainLayout.tsx
import React, { useEffect, useState } from 'react';
import WebHeader from '../components/Header/Header';
import MobileHeader from '../components/HeaderMobile/Header';

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div>
      {isMobile ? <MobileHeader /> : <WebHeader />}
      <main>{children}</main>
    </div>
  );
};

export default MainLayout;
