import React from 'react'
import { Navbar } from '../components/navbar'
import { Outlet } from 'react-router-dom'
// import { Footer } from '../components/footer'

export function MainLayout() {
    return (
        <div className="min-h-screen bg-slate-2000 ">
            <Navbar />
            <main className="max-w-md  mx-auto p-1 bg-[#F9F8F6]">
                <Outlet />
            </main>
            {/* <Footer /> */}   
        </div>
    )
}
/*  text-white p-6 rounded-lg shadow-md max-w-md w-full 
from-slate-900 → to-blue-800
*/