import { useState } from 'react';
import { addSpace } from '../api/space';
import { useAuth } from '../store/auth';
import { useNavigate, Link } from 'react-router-dom';
import { Plus, ArrowLeft, FileText, CheckCircle, AlertCircle, LogOut } from 'lucide-react';

const AddSpace = () => {
  const { token, logout, user } = useAuth();
  const navigate = useNavigate();
  
  const [title, setTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleAddSpace = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError('Please enter a space title');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      if (!token) throw new Error('Unauthorized: No token found');
      
      const res = await addSpace({ title: title.trim()}, token);
      console.log('Space added:', res.data);
      
      setSuccess(true);
      
      // Redirect to the new space after a short delay
      setTimeout(() => {
        navigate(`/spaces/${res.data.id}`);
      }, 1500);
      
    } catch (err: any) {
      console.error('Add space error:', err);
      setError(err.response?.data?.message || err.message || 'Failed to add space');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

  const resetForm = () => {
    setTitle('');
    setError(null);
    setSuccess(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Link
                to="/spaces"
                className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors mr-4"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to Spaces
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Create New Space</h1>
                <p className="text-sm text-gray-600">
                  Welcome{user?.email && `, ${user.email}`}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center">
              <FileText className="w-5 h-5 text-indigo-600 mr-2" />
              <h2 className="text-lg font-medium text-gray-900">Space Details</h2>
            </div>
            <p className="mt-1 text-sm text-gray-600">
              Create a new collaborative space for your team or project.
            </p>
          </div>

          <form onSubmit={handleAddSpace} className="p-6">
            {/* Success Message */}
            {success && (
              <div className="mb-6 bg-green-50 border border-green-200 rounded-md p-4">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                  <div>
                    <h3 className="text-sm font-medium text-green-800">Space created successfully!</h3>
                    <p className="text-sm text-green-700 mt-1">
                      Redirecting you to your new space...
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
                <div className="flex items-center">
                  <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                  <div>
                    <h3 className="text-sm font-medium text-red-800">Error</h3>
                    <p className="text-sm text-red-700 mt-1">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-6">
              {/* Title Field */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Space Title *
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (error && e.target.value.trim()) setError(null);
                  }}
                  placeholder="Enter a descriptive title for your space"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  maxLength={100}
                  required
                />
                <p className="mt-1 text-xs text-gray-500">
                  {title.length}/100 characters
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex items-center justify-between pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={resetForm}
                disabled={isLoading || success}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Clear Form
              </button>
              
              <div className="flex items-center space-x-3">
                <Link
                  to="/spaces"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={isLoading || !title.trim() || success}
                  className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      Create Space
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Tips Section */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-blue-900 mb-3">Tips for creating effective spaces</h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li className="flex items-start">
              <span className="font-medium mr-2">•</span>
              Choose a clear, descriptive title that explains the space's purpose
            </li>
            <li className="flex items-start">
              <span className="font-medium mr-2">•</span>
              Add a detailed description to help team members understand the context
            </li>
            <li className="flex items-start">
              <span className="font-medium mr-2">•</span>
              You can always edit the title and content after creating the space
            </li>
            <li className="flex items-start">
              <span className="font-medium mr-2">•</span>
              Invite team members to collaborate once your space is ready
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
};

export default AddSpace;