import React from 'react';
import { Outlet } from 'react-router-dom';


export default function MyProgressLayout() {
  
  return (
    <div className="my-progress-layout">
      <header>
        <h1 className="text-2xl font-bold"> Progression</h1>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}

