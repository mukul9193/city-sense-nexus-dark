
import React from 'react';
import Header from './Header';

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container mx-auto max-w-screen-2xl px-4 py-8">
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
