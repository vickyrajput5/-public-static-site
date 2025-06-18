"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { fetchContents, deleteContent } from "@/lib/redux/contentSlice";
import Navigation from "@/components/Navigation";
import ContentForm from "@/components/ContentForm";
import { Plus, Edit, Trash2, Loader2 } from "lucide-react";
import { format } from "date-fns";
import toast from "react-hot-toast";

export default function AdminPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { contents, loading, error } = useSelector(
    (state: RootState) => state.content
  );
  const [showForm, setShowForm] = useState(false);
  const [editingContent, setEditingContent] = useState<any>(null);

  useEffect(() => {
    dispatch(fetchContents());
  }, [dispatch]);

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this content?")) {
      try {
        await dispatch(deleteContent(id)).unwrap();
        toast.success("Content deleted successfully");
      } catch (error) {
        toast.error("Failed to delete content");
      }
    }
  };

  const handleEdit = (content: any) => {
    setEditingContent(content);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingContent(null);
  };

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

  return (
    <div className='min-h-screen bg-gray-50'>
      <Navigation />
      <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
        <div className='flex justify-between items-center mb-8'>
          <h1 className='text-3xl font-bold text-gray-900'>
            Content Management
          </h1>
          <button
            onClick={() => setShowForm(true)}
            className='inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700'
          >
            <Plus className='w-4 h-4 mr-2' />
            Add Content
          </button>
        </div>

        {error && (
          <div className='mb-6 p-4 bg-red-50 border border-red-200 rounded-md'>
            <p className='text-red-800'>{error}</p>
          </div>
        )}

        {contents.length === 0 ? (
          <div className='text-center py-12'>
            <h2 className='text-2xl font-semibold text-gray-900 mb-4'>
              No Content Available
            </h2>
            <p className='text-gray-600 mb-8'>
              Get started by creating your first piece of content.
            </p>
            <button
              onClick={() => setShowForm(true)}
              className='inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700'
            >
              <Plus className='w-4 h-4 mr-2' />
              Create Content
            </button>
          </div>
        ) : (
          <div className='bg-white shadow overflow-hidden sm:rounded-md'>
            <ul className='divide-y divide-gray-200'>
              {contents.map((content) => (
                <li key={content.id} className='px-6 py-4'>
                  <div className='flex items-center justify-between'>
                    <div className='flex-1'>
                      <h3 className='text-lg font-medium text-gray-900'>
                        {content.title}
                      </h3>
                      <p className='text-gray-600 mt-1 line-clamp-2'>
                        {content.description}
                      </p>
                      <div className='flex items-center mt-2 text-sm text-gray-500'>
                        <span>
                          Created:{" "}
                          {format(new Date(content.createdAt), "MMM dd, yyyy")}
                        </span>
                        <span className='mx-2'>•</span>
                        <span>
                          Updated:{" "}
                          {format(new Date(content.updatedAt), "MMM dd, yyyy")}
                        </span>
                      </div>
                    </div>
                    <div className='flex items-center space-x-2 ml-4'>
                      <button
                        onClick={() => handleEdit(content)}
                        className='p-2 text-gray-400 hover:text-gray-600'
                      >
                        <Edit className='w-4 h-4' />
                      </button>
                      <button
                        onClick={() => handleDelete(content.id)}
                        className='p-2 text-gray-400 hover:text-red-600'
                      >
                        <Trash2 className='w-4 h-4' />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </main>

      {showForm && (
        <ContentForm content={editingContent} onClose={handleFormClose} />
      )}
    </div>
  );
}
