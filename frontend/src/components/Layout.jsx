"use client";

import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const Layout = ({ children, showSidebar = false }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  // Close sidebar when screen size changes to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Prevent body scroll when sidebar is open on mobile
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [sidebarOpen]);

  return (
    <div className="min-h-screen bg-base-100">
      <div className="flex">
        {showSidebar && <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />}

        <div className="flex-1 flex flex-col min-h-screen">
          <Navbar showSidebar={showSidebar} onToggleSidebar={toggleSidebar} />
          <main className="flex-1 overflow-y-auto bg-base-50 lg:bg-base-100">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};
export default Layout;
