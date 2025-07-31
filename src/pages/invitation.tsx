import React, { useEffect, useState } from 'react';
import { getInvitations, acceptInvitation, rejectInvitation } from '../api/invitation';
import { useAuth } from '../store/auth';
import { 
  Mail, 
  Check, 
  X, 
  Clock, 
  FileText, 
  Loader2, 
  UserPlus,
  Calendar,
  AlertCircle,
  CheckCircle,
  XCircle
} from 'lucide-react';

interface Invitation {
  id: string;
  email: string;
  status: string;
  space: {
    title: string;
  };
  createdAt?: string;
}

const InvitationsList: React.FC = () => {
  const token = useAuth((state) => state.token);
  
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchInvites = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getInvitations(token!);
      setInvitations(response.data);
    } catch (error) {
      console.error('Failed to fetch invitations:', error);
      setError('Failed to load invitations. Please try again.');
    }
    setLoading(false);
  };

  const handleAccept = async (id: string) => {
    setProcessingId(id);
    try {
      await acceptInvitation(id, token!);
      await fetchInvites(); // Refresh list
    } catch (error) {
      console.error('Failed to accept invitation:', error);
      setError('Failed to accept invitation. Please try again.');
    }
    setProcessingId(null);
  };

  const handleReject = async (id: string) => {
    setProcessingId(id);
    try {
      await rejectInvitation(id, token!);
      await fetchInvites(); // Refresh list
    } catch (error) {
      console.error('Failed to reject invitation:', error);
      setError('Failed to reject invitation. Please try again.');
    }
    setProcessingId(null);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'ACCEPTED':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'REJECTED':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-2 py-1 text-xs font-medium rounded-full";
    switch (status) {
      case 'PENDING':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'ACCEPTED':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'REJECTED':
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  useEffect(() => {
    fetchInvites();
  }, []);

  if (loading && invitations.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
              <p className="text-gray-600">Loading your invitations...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Mail className="w-6 h-6 text-blue-600" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              My Invitations
            </h1>
          </div>
          <p className="text-gray-600">
            Manage your workspace invitations and collaborate with others
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <span className="text-red-700">{error}</span>
            <button
              onClick={() => setError(null)}
              className="ml-auto text-red-600 hover:text-red-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {loading && invitations.length > 0 && (
            <div className="p-4 bg-blue-50 border-b border-blue-100">
              <div className="flex items-center gap-2 text-blue-700">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Refreshing invitations...</span>
              </div>
            </div>
          )}

          {invitations.length === 0 && !loading ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserPlus className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No invitations yet
              </h3>
              <p className="text-gray-600 mb-6">
                You don't have any workspace invitations at the moment.
              </p>
              <button
                onClick={fetchInvites}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2 mx-auto"
              >
                <Mail className="w-4 h-4" />
                Check for invitations
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {invitations.map((invite) => (
                <div
                  key={invite.id}
                  className="p-6 hover:bg-gray-50 transition-colors duration-200"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    {/* Workspace Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-indigo-100 rounded-lg">
                          <FileText className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {invite.space.title}
                          </h3>
                          <p className="text-sm text-gray-600">
                            Invitation to collaborate
                          </p>
                        </div>
                      </div>
                      
                      {/* Status and Date */}
                      <div className="flex items-center gap-4 ml-11">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(invite.status)}
                          <span className={getStatusBadge(invite.status)}>
                            {invite.status.toLowerCase()}
                          </span>
                        </div>
                        
                        {invite.createdAt && (
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <Calendar className="w-3 h-3" />
                            {formatDate(invite.createdAt)}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    {invite.status === 'PENDING' && (
                      <div className="flex gap-2 sm:flex-shrink-0">
                        <button
                          onClick={() => handleAccept(invite.id)}
                          disabled={processingId === invite.id}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium"
                        >
                          {processingId === invite.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Check className="w-4 h-4" />
                          )}
                          Accept
                        </button>
                        
                        <button
                          onClick={() => handleReject(invite.id)}
                          disabled={processingId === invite.id}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium"
                        >
                          {processingId === invite.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <X className="w-4 h-4" />
                          )}
                          Reject
                        </button>
                      </div>
                    )}
                    
                    {invite.status !== 'PENDING' && (
                      <div className="text-sm text-gray-500 sm:flex-shrink-0">
                        {invite.status === 'ACCEPTED' ? 'Accepted' : 'Rejected'}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Refresh Button */}
        {invitations.length > 0 && (
          <div className="mt-6 text-center">
            <button
              onClick={fetchInvites}
              disabled={loading}
              className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Mail className="w-4 h-4" />
              )}
              Refresh invitations
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default InvitationsList;