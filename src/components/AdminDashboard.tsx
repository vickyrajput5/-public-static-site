"use client";

import { useState } from "react";
import ContentDisplay from "./ContentDisplay";
import ContentForm from "./ContentForm";

const AdminDashboard = () => {
  const [activeSource, setActiveSource] = useState<"strapi" | "supabase">(
    "strapi"
  );
  const [showForm, setShowForm] = useState(false);

  return (
    <div className='min-h-screen bg-gray-100'>
      <header className='bg-white shadow'>
        <div className='container mx-auto px-4 py-6'>
          <div className='flex justify-between items-center'>
            <h1 className='text-3xl font-bold text-gray-900'>
              Admin Dashboard
            </h1>
            <div className='flex space-x-4'>
              <button
                onClick={() => setActiveSource("strapi")}
                className={`px-4 py-2 rounded-md ${
                  activeSource === "strapi"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                Strapi
              </button>
              <button
                onClick={() => setActiveSource("supabase")}
                className={`px-4 py-2 rounded-md ${
                  activeSource === "supabase"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                Supabase
              </button>
              <button
                onClick={() => setShowForm(true)}
                className='px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700'
              >
                Add Content
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className='container mx-auto px-4 py-8'>
        {showForm && <ContentForm onClose={() => setShowForm(false)} />}
        <ContentDisplay />
      </main>

      <footer className='bg-white shadow-inner mt-8'>
        <div className='container mx-auto px-4 py-6'>
          <p className='text-center text-gray-500'>
            &copy; {new Date().getFullYear()} Content Management System
          </p>
        </div>
      </footer>
    </div>
  );
};

export default AdminDashboard;
