"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { fetchContents } from "@/lib/redux/contentSlice";
import { format } from "date-fns";

const ContentDisplay = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { contents, loading, error } = useSelector(
    (state: RootState) => state.content
  );

  useEffect(() => {
    dispatch(fetchContents());
  }, [dispatch]);

  if (loading) {
    return (
      <div className='flex justify-center items-center py-8'>
        <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500'></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4'>
        <p>Error: {error}</p>
      </div>
    );
  }

  if (contents.length === 0) {
    return (
      <div className='bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4'>
        <p>
          No content available. Please add some content using the admin panel.
        </p>
      </div>
    );
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='mb-6'>
        <h1 className='text-3xl font-bold'>Content Management System</h1>
        <p className='text-gray-600 mt-2'>
          Displaying content from your connected sources
        </p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {contents.map((content) => (
          <div
            key={content.id}
            className='bg-white shadow-md rounded-lg overflow-hidden'
          >
            <div className='p-6'>
              <h2 className='text-xl font-semibold mb-2'>{content.title}</h2>
              <p className='text-gray-600 mb-4'>{content.description}</p>
              <div className='text-sm text-gray-500'>
                <p>
                  Created:{" "}
                  {format(new Date(content.createdAt), "MMM dd, yyyy HH:mm")}
                </p>
                <p>
                  Updated:{" "}
                  {format(new Date(content.updatedAt), "MMM dd, yyyy HH:mm")}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContentDisplay;
