"use client";

import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/lib/redux/store";
import { createContent, updateContent } from "@/lib/redux/contentSlice";
import { Content } from "@/types";
import { X } from "lucide-react";
import toast from "react-hot-toast";

interface ContentFormProps {
  content?: Content | null;
  onClose: () => void;
}

export default function ContentForm({ content, onClose }: ContentFormProps) {
  const dispatch = useDispatch<AppDispatch>();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (content) {
      setFormData({
        title: content.title,
        description: content.description,
      });
    }
  }, [content]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (content) {
        await dispatch(
          updateContent({ id: content.id, data: formData })
        ).unwrap();
        toast.success("Content updated successfully");
      } else {
        await dispatch(createContent(formData)).unwrap();
        toast.success("Content created successfully");
      }
      onClose();
    } catch (error) {
      toast.error(
        content ? "Failed to update content" : "Failed to create content"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-white rounded-lg shadow-xl max-w-md w-full mx-4'>
        <div className='flex justify-between items-center p-6 border-b'>
          <h2 className='text-xl font-semibold text-gray-900'>
            {content ? "Edit Content" : "Create Content"}
          </h2>
          <button
            onClick={onClose}
            className='text-gray-400 hover:text-gray-600'
          >
            <X className='w-5 h-5' />
          </button>
        </div>

        <form onSubmit={handleSubmit} className='p-6'>
          <div className='mb-4'>
            <label
              htmlFor='title'
              className='block text-sm font-medium text-gray-700 mb-2'
            >
              Title
            </label>
            <input
              type='text'
              id='title'
              name='title'
              value={formData.title}
              onChange={handleChange}
              required
              className='input'
              placeholder='Enter content title'
            />
          </div>

          <div className='mb-6'>
            <label
              htmlFor='description'
              className='block text-sm font-medium text-gray-700 mb-2'
            >
              Description
            </label>
            <textarea
              id='description'
              name='description'
              value={formData.description}
              onChange={handleChange}
              required
              rows={4}
              className='input resize-none'
              placeholder='Enter content description'
            />
          </div>

          <div className='flex justify-end space-x-3'>
            <button
              type='button'
              onClick={onClose}
              className='btn btn-outline px-4 py-2'
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type='submit'
              className='btn btn-primary px-4 py-2'
              disabled={loading}
            >
              {loading ? "Saving..." : content ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
