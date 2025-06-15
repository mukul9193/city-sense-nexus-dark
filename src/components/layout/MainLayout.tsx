
import React from 'react';
import Header from './Header';

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container max-w-screen-2xl py-8">
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
