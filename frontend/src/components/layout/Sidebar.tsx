import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Car,
  Users,
  Calendar,
  BarChart3,
  Settings,
  Building2,
  Tag,
  Clock,
  Map,
  Users2,
  FileText,
  X,
  LogOut,
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import * as Types from '../../types';
type UserRole = Types.UserRole;

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  roles?: UserRole[];
}

const navigation: NavItem[] = [
  {
    name: 'Dashboard',
    href: '/',
    icon: LayoutDashboard,
  },
  {
    name: 'Fleet Management',
    href: '/fleet',
    icon: Car,
    roles: [Types.UserRole.ADMIN, Types.UserRole.MANAGER],
  },
  {
    name: 'Driver Management',
    href: '/drivers',
    icon: Users,
    roles: [Types.UserRole.ADMIN, Types.UserRole.MANAGER],
  },
  {
    name: 'Bookings',
    href: '/bookings',
    icon: Calendar,
  },
  {
    name: 'Analytics',
    href: '/analytics',
    icon: BarChart3,
    roles: [Types.UserRole.ADMIN, Types.UserRole.MANAGER],
  },
  {
    name: 'Branches',
    href: '/branches',
    icon: Building2,
    roles: [Types.UserRole.ADMIN, Types.UserRole.MANAGER],
  },
  {
    name: 'Car Classes',
    href: '/car-classes',
    icon: Tag,
    roles: [Types.UserRole.ADMIN, Types.UserRole.MANAGER],
  },
  {
    name: 'Shift',
    href: '/shift',
    icon: Clock,
    roles: [Types.UserRole.ADMIN, Types.UserRole.MANAGER],
  },
  {
    name: 'Live Map',
    href: '/live-map',
    icon: Map,
    roles: [Types.UserRole.ADMIN, Types.UserRole.MANAGER, Types.UserRole.DISPATCHER],
  },
  {
    name: 'Drivers Enhanced',
    href: '/drivers-enhanced',
    icon: Users2,
    roles: [Types.UserRole.ADMIN, Types.UserRole.MANAGER],
  },
  {
    name: 'Shift Report',
    href: '/shift-report',
    icon: FileText,
    roles: [Types.UserRole.ADMIN, Types.UserRole.MANAGER],
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: Settings,
    roles: [Types.UserRole.ADMIN],
  },
];

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { user, logout } = useAuthStore();

  const filteredNavigation = navigation.filter(
    (item) => !item.roles || (user?.role && item.roles.includes(user.role))
  );

  const handleLogout = () => {
    logout();
    onClose();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo and close button */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
            <div className="flex items-center">
              <Car className="h-8 w-8 text-primary-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">
                TaxiPark
              </span>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1">
            {filteredNavigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={onClose}
                  className={`
                    sidebar-nav-item
                    ${isActive ? 'active' : ''}
                  `}
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* User info and logout */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex items-center mb-4">
              <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                <span className="text-sm font-medium text-primary-700">
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-gray-500 capitalize">
                  {user?.role}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 hover:text-gray-900"
            >
              <LogOut className="h-4 w-4 mr-3" />
              Sign out
            </button>
          </div>
        </div>
      </div>
    </>
  );
};