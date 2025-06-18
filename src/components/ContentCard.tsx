"use client";

import { Content } from "@/types";
import { format } from "date-fns";
import { Calendar, Clock } from "lucide-react";

interface ContentCardProps {
  content: Content;
}

export default function ContentCard({ content }: ContentCardProps) {
  return (
    <div className='card hover:shadow-md transition-shadow duration-200'>
      <div className='mb-4'>
        <h3 className='text-xl font-semibold text-gray-900 mb-2 line-clamp-2'>
          {content.title}
        </h3>
        <p className='text-gray-600 line-clamp-3'>{content.description}</p>
      </div>

      <div className='flex items-center justify-between text-sm text-gray-500'>
        <div className='flex items-center'>
          <Calendar className='w-4 h-4 mr-1' />
          <span>{format(new Date(content.createdAt), "MMM dd, yyyy")}</span>
        </div>
        <div className='flex items-center'>
          <Clock className='w-4 h-4 mr-1' />
          <span>{format(new Date(content.updatedAt), "MMM dd, yyyy")}</span>
        </div>
      </div>
    </div>
  );
}
