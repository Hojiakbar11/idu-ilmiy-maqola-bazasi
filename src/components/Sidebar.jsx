import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Library, FileUp, Settings, LogOut } from 'lucide-react';

const Sidebar = () => {
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'My Articles', path: '/articles', icon: Library },
    { name: 'Upload Article', path: '/upload', icon: FileUp },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-full shadow-sm relative z-10">
      <div className="p-6">
        <h1 className="text-xl font-bold text-primary-600 tracking-tight leading-tight">
          IDU<br/><span className="text-gray-900">Scholar Hub</span>
        </h1>
      </div>

      <nav className="flex-1 px-4 space-y-1 overflow-y-auto mt-4">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center px-4 py-3 rounded-lg transition-colors duration-200 ${
                isActive
                  ? 'bg-primary-50 text-primary-700 font-medium'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            <item.icon className="w-5 h-5 mr-3 flex-shrink-0" />
            {item.name}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
          <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold flex-shrink-0">
            DR
          </div>
          <div className="ml-3 overflow-hidden">
            <p className="text-sm font-medium text-gray-900 truncate">Dr. Robert Smith</p>
            <p className="text-xs text-gray-500 truncate">Computer Science</p>
          </div>
          <LogOut className="w-4 h-4 ml-auto text-gray-400 hover:text-red-500" />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
