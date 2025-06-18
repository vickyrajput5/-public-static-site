"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { fetchContents } from "@/lib/redux/contentSlice";
import Navigation from "@/components/Navigation";
import ContentCard from "@/components/ContentCard";
import DemoBanner from "@/components/DemoBanner";
import { Loader2 } from "lucide-react";

export default function HomePage() {
  const dispatch = useDispatch<AppDispatch>();
  const { contents, loading, error } = useSelector(
    (state: RootState) => state.content
  );

  useEffect(() => {
    dispatch(fetchContents());
  }, [dispatch]);

  if (loading) {
    return (
      <div className='min-h-screen bg-gray-50'>
        <Navigation />
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
          <div className='flex justify-center items-center h-64'>
            <Loader2 className='w-8 h-8 animate-spin text-primary-600' />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='min-h-screen bg-gray-50'>
        <Navigation />
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
          <div className='text-center'>
            <h2 className='text-2xl font-semibold text-gray-900 mb-4'>
              Error Loading Content
            </h2>
            <p className='text-gray-600'>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      <Navigation />

      <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
        <div className='text-center mb-12'>
          <h1 className='text-4xl font-bold text-gray-900 mb-4'>
            Welcome to Content Platform
          </h1>
          <p className='text-xl text-gray-600 max-w-3xl mx-auto'>
            A modern content management platform powered by Next.js, Strapi CMS,
            and Supabase.
          </p>
        </div>

        {contents.length === 0 ? (
          <div className='text-center py-12'>
            <h2 className='text-2xl font-semibold text-gray-900 mb-4'>
              No Content Available
            </h2>
            <p className='text-gray-600 mb-8'>
              Get started by creating your first piece of content in the admin
              panel.
            </p>
            <a
              href='/admin/new'
              className='inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700'
            >
              Create Content
            </a>
          </div>
        ) : (
          <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
            {contents.map((content) => (
              <ContentCard key={content.id} content={content} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
