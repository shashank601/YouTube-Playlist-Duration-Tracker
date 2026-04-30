import React from "react";
import { Outlet } from "react-router-dom";

export function AuthLayout() {
  return (
    <div>
      <main className="min-h-[90vh] flex items-center justify-center">
        <Outlet />
      </main>
    </div>
  );
}
