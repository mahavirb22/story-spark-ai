import React, { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { MenuItem, menuItems } from "./dashboard.utils";
import { getUserInfo } from "../../services/auth.service";

const DashboardLayout: React.FC = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({});

  const location = useLocation();
  const navigate = useNavigate();

  const user = getUserInfo();

  const currentPage = menuItems
    .flatMap((item) => (item.subRoutes ? [item, ...item.subRoutes] : [item]))
    .find(
      (item) =>
        location.pathname === item.path ||
        location.pathname.startsWith(item.path + "/")
    );

  const pageTitle = currentPage?.name || "Dashboard";

  const accessibleMenuItems = menuItems.filter((item) =>
    item.roles.includes(user?.role || "user")
  );

  const toggleSubMenu = (name: string) => {
    setExpanded((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  const handleNavigation = (item: MenuItem) => {
    if (item.subRoutes) {
      toggleSubMenu(item.name);
    } else {
      navigate(item.path);
    }
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-[#070c18] text-white">
      {/* Ambient background glows */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-0 left-1/3 w-[500px] h-[300px] bg-blue-700/8 rounded-full blur-[130px]" />
        <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] bg-indigo-600/6 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 w-[600px] h-[200px] bg-cyan-700/4 rounded-full blur-[150px]" />
      </div>

      {/* Header */}
      <header className="relative z-20 px-6 py-3 bg-[#0a1020]/95 backdrop-blur-xl border-b border-white/[0.06] shadow-[0_1px_40px_rgba(0,0,0,0.4)]">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link to="/">
              <button className="group flex items-center justify-center w-9 h-9 rounded-xl bg-white/[0.05] border border-white/[0.08] text-slate-400 hover:text-white hover:bg-blue-500/10 hover:border-blue-500/30 transition-all duration-200">
                <i className="fas fa-arrow-left text-xs group-hover:-translate-x-0.5 transition-transform duration-200"></i>
              </button>
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
                <i className="fas fa-chart-line text-white text-xs"></i>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.15em] text-blue-400/60 font-medium leading-none mb-1">Admin Panel</p>
                <h1 className="text-base font-bold text-white tracking-tight leading-none">{pageTitle}</h1>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Search bar */}
            <div className="hidden md:flex items-center gap-2 px-3 py-2 bg-white/[0.04] border border-white/[0.07] rounded-xl text-slate-500 hover:bg-white/[0.07] hover:border-white/[0.12] transition-all duration-200 cursor-pointer">
              <i className="fas fa-search text-[11px]"></i>
              <span className="text-xs">Quick search...</span>
              <kbd className="ml-3 text-[10px] px-1.5 py-0.5 bg-white/[0.08] rounded text-slate-600 font-mono">⌘K</kbd>
            </div>

            {/* Notifications */}
            <div className="relative">
              <button className="flex items-center justify-center w-9 h-9 rounded-xl bg-white/[0.05] border border-white/[0.08] text-slate-400 hover:text-white hover:bg-white/[0.08] transition-all duration-200">
                <i className="fa-solid fa-bell text-sm"></i>
              </button>
              <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[17px] h-[17px] px-1 rounded-full bg-gradient-to-br from-red-500 to-rose-600 text-[9px] font-bold text-white shadow-lg shadow-red-500/40">
                5
              </span>
            </div>

            <div className="w-px h-5 bg-white/[0.08] mx-1"></div>

            {/* User */}
            <button className="flex items-center gap-2.5 px-2 py-1.5 rounded-xl hover:bg-white/[0.05] transition-colors">
              <div className="relative">
                <img
                  className="h-8 w-8 rounded-xl border border-blue-500/30 shadow-lg shadow-blue-500/15 object-cover"
                  src="https://avatars.githubusercontent.com/u/76697055?v=4"
                  alt="profile"
                />
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-[2px] border-[#0a1020] shadow"></span>
              </div>
              <div className="hidden md:block text-left">
                <p className="text-xs font-semibold text-white leading-none mb-0.5">Admin User</p>
                <p className="text-[10px] text-slate-500 leading-none">Super Admin</p>
              </div>
              <i className="fas fa-chevron-down text-[9px] text-slate-600 hidden md:block ml-1"></i>
            </button>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden relative z-10">
        {/* Sidebar */}
        <aside
          className={`relative bg-[#0a1020]/80 backdrop-blur-xl border-r border-white/[0.05] transition-all duration-300 ease-in-out ${
            isSidebarCollapsed ? "w-[68px]" : "w-60"
          } flex flex-col shrink-0`}
        >
          <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
            {!isSidebarCollapsed && (
              <p className="text-[9px] uppercase tracking-[0.18em] text-slate-600 font-semibold px-3 pt-3 pb-2">
                Main Menu
              </p>
            )}

            {accessibleMenuItems.map((item) => {
              const isActive =
                location.pathname === item.path ||
                location.pathname.startsWith(item.path + "/");

              return (
                <div key={item.name}>
                  <div
                    className={`group relative flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-xl cursor-pointer transition-all duration-200 ${
                      isActive
                        ? "bg-blue-500/12 text-blue-300 border border-blue-500/20"
                        : "text-slate-400 hover:bg-white/[0.05] hover:text-slate-200 border border-transparent"
                    }`}
                    onClick={() => handleNavigation(item)}
                    title={isSidebarCollapsed ? item.name : undefined}
                  >
                    {isActive && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-blue-400 rounded-r-full"></span>
                    )}
                    <div className={`flex items-center ${isSidebarCollapsed ? "justify-center w-full" : "gap-3"}`}>
                      <div className={`flex items-center justify-center w-7 h-7 rounded-lg transition-all duration-200 ${
                        isActive
                          ? "bg-blue-500/20 shadow-sm shadow-blue-500/20"
                          : "bg-white/[0.04] group-hover:bg-white/[0.08]"
                      }`}>
                        <i className={`${item.icon} text-xs ${
                          isActive ? "text-blue-400" : "text-slate-500 group-hover:text-slate-300"
                        }`}></i>
                      </div>
                      {!isSidebarCollapsed && <span>{item.name}</span>}
                    </div>

                    {item.subRoutes && !isSidebarCollapsed && (
                      <i className={`fas fa-chevron-down text-[10px] transition-transform duration-200 ${
                        expanded[item.name] ? "rotate-180" : ""
                      } text-slate-600`}></i>
                    )}
                  </div>

                  {item.subRoutes && expanded[item.name] && !isSidebarCollapsed && (
                    <div className="mt-0.5 ml-3 pl-3 border-l border-white/[0.07] space-y-0.5">
                      {item.subRoutes.map((subItem) => (
                        <Link
                          key={subItem.name}
                          to={subItem.path}
                          className={`flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-lg transition-all duration-200 ${
                            location.pathname === subItem.path
                              ? "bg-blue-500/12 text-blue-400 border border-blue-500/20"
                              : "text-slate-500 hover:text-slate-300 hover:bg-white/[0.05] border border-transparent"
                          }`}
                        >
                          <div className="w-1 h-1 rounded-full bg-current opacity-60"></div>
                          {subItem.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Sidebar Footer */}
          <div className="p-3 border-t border-white/[0.05]">
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className={`w-full flex items-center justify-center gap-2 px-3 py-2.5 text-xs font-medium text-slate-500 hover:text-slate-300 bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.07] hover:border-white/[0.12] rounded-xl transition-all duration-200`}
            >
              <i className={`fas ${isSidebarCollapsed ? "fa-chevron-right" : "fa-chevron-left"} text-[10px]`}></i>
              {!isSidebarCollapsed && <span>Collapse Sidebar</span>}
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto bg-[#070c18]">
          <div className="p-6 md:p-8 min-h-screen">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
