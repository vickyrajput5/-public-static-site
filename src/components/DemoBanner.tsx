"use client";

import { AlertCircle } from "lucide-react";

export default function DemoBanner() {
  return (
    <div className='bg-yellow-50 border-b border-yellow-200'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3'>
        <div className='flex items-center justify-center'>
          <AlertCircle className='w-5 h-5 text-yellow-600 mr-2' />
          <p className='text-sm text-yellow-800'>
            <strong>Demo Mode:</strong> Strapi CMS is not connected. You're
            viewing demo content.
            <a
              href='/SETUP-INSTRUCTIONS.md'
              className='ml-2 underline hover:text-yellow-900'
              target='_blank'
              rel='noopener noreferrer'
            >
              Setup Instructions
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
