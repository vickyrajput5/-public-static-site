"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { fetchContents } from "@/lib/redux/contentSlice";
import { format } from "date-fns";

const PublicContent = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { contents, loading, error } = useSelector(
    (state: RootState) => state.content
  );

  useEffect(() => {
    dispatch(fetchContents());
  }, [dispatch]);

  if (loading) {
    return (
      <div className='flex justify-center items-center py-12'>
        <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500'></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='max-w-4xl mx-auto px-4 py-8'>
        <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4'>
          <p>Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className='max-w-6xl mx-auto px-4 py-12'>
      <h1 className='text-4xl font-bold text-center mb-12'>Latest Content</h1>

      {contents.length === 0 ? (
        <div className='text-center py-8'>
          <p className='text-xl text-gray-600'>
            No content available at the moment.
          </p>
        </div>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
          {contents.map((content) => (
            <div
              key={content.id}
              className='bg-white rounded-lg shadow-lg overflow-hidden transition-transform hover:scale-105'
            >
              <div className='p-6'>
                <h2 className='text-2xl font-bold mb-3'>{content.title}</h2>
                <p className='text-gray-700 mb-4 text-lg'>
                  {content.description}
                </p>
                <div className='text-sm text-gray-500 mt-4'>
                  <p>
                    Published:{" "}
                    {format(new Date(content.createdAt), "MMM dd, yyyy HH:mm")}
                  </p>
                  <p>
                    Last updated:{" "}
                    {format(new Date(content.updatedAt), "MMM dd, yyyy HH:mm")}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PublicContent;
