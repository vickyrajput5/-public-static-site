import Link from "next/link";

export default function NotFound() {
  return (
    <div className='min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8'>
      <div className='mt-8 sm:mx-auto sm:w-full sm:max-w-md'>
        <div className='bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10'>
          <div className='text-center'>
            <h1 className='text-6xl font-bold text-gray-900 mb-4'>404</h1>
            <h2 className='text-2xl font-semibold text-gray-900 mb-4'>
              Page Not Found
            </h2>
            <p className='text-gray-600 mb-8'>
              The page you're looking for doesn't exist or has been moved.
            </p>
            <Link
              href='/'
              className='inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700'
            >
              Go back home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
