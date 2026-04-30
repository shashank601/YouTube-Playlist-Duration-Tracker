import React from 'react';
import { Outlet } from 'react-router-dom';
import SearchBar from '../components/searchbar';


export default function SearchLayout() {
  
  return (
    <div className="search-layout">
      <header>
        <SearchBar />
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}