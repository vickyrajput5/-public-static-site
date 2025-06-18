"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { fetchContents, deleteContent } from "@/lib/redux/contentSlice";
import Navigation from "@/components/Navigation";
import ContentForm from "@/components/ContentForm";
import { Plus, Edit, Trash2, Loader2, AlertTriangle } from "lucide-react";
import { format } from "date-fns";
import toast from "react-hot-toast";

export default function AdminPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { contents, loading, error } = useSelector(
    (state: RootState) => state.content
  );
  const [showForm, setShowForm] = useState(false);
  const [editingContent, setEditingContent] = useState<any>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [contentToDelete, setContentToDelete] = useState<any>(null);

  useEffect(() => {
    dispatch(fetchContents());
  }, [dispatch]);

  const handleDeleteClick = (content: any) => {
    setContentToDelete(content);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (contentToDelete) {
      try {
        await dispatch(deleteContent(contentToDelete.id)).unwrap();
        toast.success("Content deleted successfully");
        setShowDeleteModal(false);
        setContentToDelete(null);
      } catch (error) {
        toast.error("Failed to delete content");
      }
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setContentToDelete(null);
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
          <h1 className='text-xl md:text-3xl font-bold text-gray-900'>
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
                        onClick={() => handleDeleteClick(content)}
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

      {/* Delete Confirmation Modal */}
      {showDeleteModal && contentToDelete && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white rounded-lg shadow-xl max-w-md w-full mx-4'>
            <div className='flex items-center p-6 border-b border-red-200 bg-red-50'>
              <AlertTriangle className='w-6 h-6 text-red-600 mr-3' />
              <h2 className='text-xl font-semibold text-red-900'>
                Confirm Deletion
              </h2>
            </div>

            <div className='p-6'>
              <p className='text-gray-700 mb-4'>
                Are you sure you want to delete this content?
              </p>
              <div className='bg-gray-50 p-4 rounded-md mb-6'>
                <h3 className='font-semibold text-gray-900 mb-2'>
                  {contentToDelete.title}
                </h3>
                <p className='text-gray-600 text-sm'>
                  {contentToDelete.description}
                </p>
              </div>
              <p className='text-red-600 text-sm mb-6'>
                <strong>Warning:</strong> This action cannot be undone. The
                content will be permanently deleted.
              </p>

              <div className='flex justify-end space-x-3'>
                <button
                  onClick={handleDeleteCancel}
                  className='px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500'
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className='px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'
                >
                  Delete Content
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
