import { Link } from 'react-router-dom';
import { useAuth } from '../store/auth';
import { Navigate } from 'react-router-dom';

export default function HomePage() {
  const { token } = useAuth();
  
  // If user is already logged in, redirect to spaces
  if (token) {
    return <Navigate to="/spaces" replace />;
  }

  return (
    <div className="flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Welcome to SpaceApp
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Please sign in to your account or create a new one
          </p>
        </div>
        <div className="mt-8 space-y-6">
          <div className="space-y-4">
            <Link
              to="/signin"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              className="group relative w-full flex justify-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}