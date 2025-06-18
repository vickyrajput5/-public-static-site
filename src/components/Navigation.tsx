"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Settings,
  Plus,
  BarChart3,
  Database,
  Menu,
  X,
} from "lucide-react";
import ContentForm from "./ContentForm";

export default function Navigation() {
  const pathname = usePathname();
  const [showForm, setShowForm] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/admin", label: "Admin", icon: Settings },
    { href: "/admin/dashboard", label: "Dashboard", icon: BarChart3 },
    { href: "/admin/sources", label: "Sources", icon: Database },
  ];

  const handleFormClose = () => {
    setShowForm(false);
  };

  const handleMobileMenuClose = () => {
    setShowMobileMenu(false);
  };

  const handleNavItemClick = () => {
    setShowMobileMenu(false);
  };

  return (
    <>
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
            <div className='flex items-center space-x-4'>
              <button
                onClick={() => setShowForm(true)}
                className='hidden sm:inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
              >
                <Plus className='w-4 h-4 mr-2' />
                New Content
              </button>
              <button
                onClick={() => setShowMobileMenu(true)}
                className='sm:hidden inline-flex items-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100'
              >
                <Menu className='w-6 h-6' />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className='fixed inset-0 z-50 sm:hidden'>
          {/* Backdrop */}
          <div
            className='fixed inset-0 bg-black bg-opacity-50'
            onClick={handleMobileMenuClose}
          />

          {/* Mobile Menu Panel */}
          <div className='fixed bottom-0 right-0 w-80 h-auto bg-white shadow-xl rounded-tl-lg'>
            {/* Header with close button */}
            <div className='flex items-center justify-between p-4 border-b border-gray-200'>
              <h2 className='text-lg font-semibold text-gray-900'>Menu</h2>
              <button
                onClick={handleMobileMenuClose}
                className='p-2 text-gray-400 hover:text-gray-600'
              >
                <X className='w-5 h-5' />
              </button>
            </div>

            {/* Navigation Items */}
            <div className='p-4'>
              <div className='space-y-2'>
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={handleNavItemClick}
                      className={`flex items-center px-3 py-3 rounded-md text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-primary-50 text-primary-700 border-l-4 border-primary-500"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <Icon className='w-5 h-5 mr-3' />
                      {item.label}
                    </Link>
                  );
                })}
              </div>

              {/* New Content Button for Mobile */}
              <div className='mt-6 pt-4 border-t border-gray-200'>
                <button
                  onClick={() => {
                    setShowForm(true);
                    handleMobileMenuClose();
                  }}
                  className='w-full inline-flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
                >
                  <Plus className='w-4 h-4 mr-2' />
                  New Content
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showForm && <ContentForm onClose={handleFormClose} />}
    </>
  );
}
