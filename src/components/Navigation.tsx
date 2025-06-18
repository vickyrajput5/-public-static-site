"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Settings, Plus, BarChart3, Database } from "lucide-react";

export default function Navigation() {
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/admin", label: "Admin", icon: Settings },
    { href: "/admin/dashboard", label: "Dashboard", icon: BarChart3 },
    { href: "/admin/sources", label: "Sources", icon: Database },
  ];

  return (
    <nav className='bg-white shadow-sm border-b'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between h-16'>
          <div className='flex'>
            <div className='flex-shrink-0 flex items-center'>
              <h1 className='text-xl font-semibold text-gray-900'>
                Content Platform
              </h1>
            </div>
            <div className='hidden sm:ml-6 sm:flex sm:space-x-8'>
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      isActive
                        ? "border-primary-500 text-gray-900"
                        : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                    }`}
                  >
                    <Icon className='w-4 h-4 mr-2' />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
          <div className='flex items-center'>
            <Link
              href='/admin/new'
              className='inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
            >
              <Plus className='w-4 h-4 mr-2' />
              New Content
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
