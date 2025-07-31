import { useEffect, useState } from "react";
import { getSpaces } from "../api/space";
import { useAuth } from "../store/auth";
import { Link } from "react-router-dom";
import { Plus, Calendar, User, FileText, LogOut } from "lucide-react";

interface Space {
  id: string;
  title: string;
  content: string;
  ownerId: string;
  createdAt: string;
}

const GetSpaces = () => {
  const { token, logout, user } = useAuth();

  const [spaces, setSpaces] = useState<Space[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSpaces = async () => {
      if (!token) {
        setError("Token not found");
        setIsLoading(false);
        return;
      }

      try {
        const data = await getSpaces(token);
        console.log("data", data);
        setSpaces(data.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch spaces");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSpaces();
  }, [token]);

  const handleLogout = () => {
    logout();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading spaces...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
            <div className="text-red-600 text-xl font-semibold mb-2">Error</div>
            <p className="text-red-700">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Your Spaces</h1>
              <p className="text-sm text-gray-600">
                Welcome back{user?.email && `, ${user.email}`}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/addSpace"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Space
              </Link>
              <Link
                to="/invites"
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              >
                Invitations
              </Link>
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {spaces.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No spaces found</h3>
            <p className="text-gray-600 mb-6">Get started by creating your first space.</p>
            <Link
              to="/addSpace"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Your First Space
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {spaces.map((space) => (
              <div
                key={space.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                    <Link
                      to={`/spaces/${space.id}`}
                      className="hover:text-indigo-600 transition-colors"
                    >
                      {space.title}
                    </Link>
                  </h3>
                  
                  {space.content && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {space.content.substring(0, 150)}
                      {space.content.length > 150 && "..."}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center">
                      <User className="w-3 h-3 mr-1" />
                      <span>{space.ownerId}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      <span>{new Date(space.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                
                <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 rounded-b-lg">
                  <Link
                    to={`/spaces/${space.id}`}
                    className="text-sm font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
                  >
                    Open space →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Stats */}
        {spaces.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Statistics</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-indigo-600">{spaces.length}</div>
                <div className="text-sm text-gray-600">Total Spaces</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {spaces.filter(space => space.ownerId === user?.id).length}
                </div>
                <div className="text-sm text-gray-600">Owned by You</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {spaces.length - spaces.filter(space => space.ownerId === user?.id).length}
                </div>
                <div className="text-sm text-gray-600">Shared with You</div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default GetSpaces;