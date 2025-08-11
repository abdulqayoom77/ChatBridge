"use client";

import { Link, useLocation } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { BellIcon, LogOutIcon, MenuIcon, ShipWheelIcon } from "lucide-react";
import ThemeSelector from "./ThemeSelector";
import useLogout from "../hooks/useLogout";
import { useNotifications } from "../context/NotificationContext";

const Navbar = ({ showSidebar, onToggleSidebar }) => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const isChatPage = location.pathname?.startsWith("/chat");
  const { logoutMutation } = useLogout();
  const { unreadCount } = useNotifications();

  return (
    <nav className="bg-base-100 lg:bg-base-200 border-b border-base-300 sticky top-0 z-30 h-16 flex items-center shadow-sm lg:shadow-none">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between w-full">
          {/* Left side - Hamburger menu and Logo */}
          <div className="flex items-center gap-3">
            {/* Hamburger menu - only show when sidebar should be shown and on mobile/tablet */}
            {showSidebar && (
              <button
                onClick={onToggleSidebar}
                className="btn btn-ghost btn-sm lg:hidden hover:bg-base-200 rounded-xl p-2"
              >
                <MenuIcon className="h-6 w-6" />
              </button>
            )}

            {/* LOGO - Show in chat page or when no sidebar */}
            {(isChatPage || !showSidebar) && (
              <Link to="/" className="flex items-center gap-2.5">
                <div className="p-1.5 bg-primary/10 rounded-lg">
                  <ShipWheelIcon className="size-6 sm:size-7 text-primary" />
                </div>
                <div className="hidden sm:block">
                  <span className="text-xl sm:text-2xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
                    Streamify
                  </span>
                </div>
              </Link>
            )}
          </div>

          {/* Right side - Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Notifications */}
            <Link to={"/notifications"} className="relative">
              <button className="btn btn-ghost btn-circle btn-sm sm:btn-md hover:bg-base-200 relative">
                <BellIcon className="h-5 w-5 sm:h-6 sm:w-6 text-base-content/70" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-error text-error-content text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold shadow-lg animate-pulse">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>
            </Link>

            {/* Theme Selector */}
            <ThemeSelector />

            {/* User Avatar */}
            <div className="avatar">
              <div className="w-8 sm:w-9 rounded-full ring-2 ring-primary/20 hover:ring-primary/40 transition-all duration-200">
                <img
                  src={authUser?.profilePic || "/placeholder.svg"}
                  alt="User Avatar"
                />
              </div>
            </div>

            {/* Logout button */}
            <button
              className="btn btn-ghost btn-circle btn-sm sm:btn-md hover:bg-base-200 hover:text-error transition-colors duration-200"
              onClick={logoutMutation}
            >
              <LogOutIcon className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
export default Navbar;
