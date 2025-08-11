"use client";

import { Link, useLocation } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { BellIcon, HomeIcon, ShipWheelIcon, XIcon } from "lucide-react";
import { useNotifications } from "../context/NotificationContext";

const Sidebar = ({ isOpen, onClose }) => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const currentPath = location.pathname;
  const { unreadCount } = useNotifications();

  const handleLinkClick = () => {
    // Close sidebar on mobile when a link is clicked
    if (onClose) {
      onClose();
    }
  };

  const navigationItems = [
    {
      path: "/",
      icon: HomeIcon,
      label: "Home",
      active: currentPath === "/",
    },
    {
      path: "/notifications",
      icon: BellIcon,
      label: "Notifications",
      active: currentPath === "/notifications",
      badge: unreadCount > 0 ? unreadCount : null,
    },
  ];

  return (
    <>
      {/* Mobile Overlay with blur effect */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
        fixed lg:sticky top-0 left-0 z-50 lg:z-auto
        w-72 lg:w-64 bg-base-100 lg:bg-base-200 
        border-r border-base-300 
        flex flex-col h-screen
        shadow-2xl lg:shadow-none
        transform transition-all duration-300 ease-out lg:transform-none
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
      >
        {/* Header */}
        <div className="p-6 lg:p-5 border-b border-base-300 bg-gradient-to-r from-primary/5 to-secondary/5 lg:bg-none">
          <div className="flex items-center justify-between">
            <Link
              to="/"
              className="flex items-center gap-3"
              onClick={handleLinkClick}
            >
              <div className="p-2 bg-primary/10 rounded-xl">
                <ShipWheelIcon className="size-7 text-primary" />
              </div>
              <div>
                <span className="text-2xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
                  ChatBridge
                </span>
                <p className="text-xs text-base-content/60 mt-0.5">
                  Bridging Languages, Building Friendships
                </p>
              </div>
            </Link>

            {/* Close button - only visible on mobile */}
            <button
              onClick={onClose}
              className="btn btn-ghost btn-sm lg:hidden hover:bg-base-300 rounded-full p-2"
            >
              <XIcon className="size-5" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 lg:p-4 space-y-2">
          <div className="mb-4">
            <p className="text-xs font-semibold text-base-content/50 uppercase tracking-wider px-3 mb-3">
              Navigation
            </p>
          </div>

          {navigationItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={handleLinkClick}
              className={`
              group flex items-center gap-4 px-4 py-3.5 rounded-xl
              transition-all duration-200 ease-out
              hover:bg-base-200 lg:hover:bg-base-300
              ${
                item.active
                  ? "bg-primary text-primary-content shadow-lg shadow-primary/20"
                  : "text-base-content/80 hover:text-base-content"
              }
            `}
            >
              <div
                className={`
                p-2 rounded-lg transition-colors duration-200
                ${
                  item.active
                    ? "bg-primary-content/20"
                    : "bg-base-content/5 group-hover:bg-base-content/10"
                }
              `}
              >
                <item.icon className="size-5" />
              </div>

              <div className="flex-1 flex items-center justify-between">
                <span className="font-medium">{item.label}</span>
                {item.badge && (
                  <span
                    className={`
                    px-2 py-1 text-xs font-bold rounded-full min-w-[20px] text-center
                    ${
                      item.active
                        ? "bg-primary-content/20 text-primary-content"
                        : "bg-error text-error-content"
                    }
                  `}
                  >
                    {item.badge > 9 ? "9+" : item.badge}
                  </span>
                )}
              </div>
            </Link>
          ))}
        </nav>

        {/* User Profile Section */}
        <div className="p-4 border-t border-base-300 bg-base-50 lg:bg-transparent">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-base-100 lg:bg-base-300/50 hover:bg-base-200 transition-colors duration-200">
            <div className="avatar">
              <div className="w-12 h-12 rounded-full ring-2 ring-primary/20">
                <img
                  src={authUser?.profilePic || "/placeholder.svg"}
                  alt="User Avatar"
                />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm truncate">
                {authUser?.fullName}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                <span className="text-xs text-success font-medium">Online</span>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
export default Sidebar;
