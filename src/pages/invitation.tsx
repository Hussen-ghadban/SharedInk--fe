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
  XCircle,
  RefreshCw,
  Inbox
} from 'lucide-react';
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Separator } from "../components/ui/separator";
import { Alert, AlertDescription } from "../components/ui/alert";
import { toast } from "sonner"

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

toast.success('invitation was accepted successfully!');
      await fetchInvites(); // Refresh list
    } catch (error) {
      console.error('Failed to accept invitation:', error);
toast.success('failed to accept the invitation!');


    }
    setProcessingId(null);
  };

  const handleReject = async (id: string) => {
    setProcessingId(id);
    try {
      await rejectInvitation(id, token!);
toast.success('invitation was rejected successfully!');

      await fetchInvites(); // Refresh list
    } catch (error) {
      console.error('Failed to reject invitation:', error);
toast.success('failed to reject the invitation!');

    }
    setProcessingId(null);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Clock className="w-4 h-4 text-amber-500" />;
      case 'ACCEPTED':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'REJECTED':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Badge variant="secondary" className="bg-amber-50 text-amber-700 border-amber-200">Pending</Badge>;
      case 'ACCEPTED':
        return <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200">Accepted</Badge>;
      case 'REJECTED':
        return <Badge variant="secondary" className="bg-red-50 text-red-700 border-red-200">Rejected</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
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

  const pendingInvitations = invitations.filter(inv => inv.status === 'PENDING');
  const processedInvitations = invitations.filter(inv => inv.status !== 'PENDING');

  if (loading && invitations.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="max-w-4xl mx-auto p-4 sm:p-6">
          <Card className="mt-8">
            <CardContent className="p-8">
              <div className="text-center space-y-4">
                <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">Loading invitations</h3>
                  <p className="text-muted-foreground">Please wait while we fetch your invitations...</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-4xl mx-auto p-4 sm:p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center">
              <Mail className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
                My Invitations
              </h1>
              <p className="text-muted-foreground">
                Manage your workspace invitations and collaborate with others
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="border-l-4 border-l-primary">
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total</p>
                    <p className="text-2xl font-bold text-primary">{invitations.length}</p>
                  </div>
                  <Inbox className="h-6 w-6 text-primary/60" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-l-4 border-l-amber-500">
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Pending</p>
                    <p className="text-2xl font-bold text-amber-600">{pendingInvitations.length}</p>
                  </div>
                  <Clock className="h-6 w-6 text-amber-500/60" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-green-500">
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Processed</p>
                    <p className="text-2xl font-bold text-green-600">{processedInvitations.length}</p>
                  </div>
                  <CheckCircle className="h-6 w-6 text-green-500/60" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              {error}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setError(null)}
                className="h-auto p-1 text-destructive hover:text-destructive"
              >
                <X className="w-4 h-4" />
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Main Content */}
        <Card className="overflow-hidden">
          {loading && invitations.length > 0 && (
            <div className="p-4 bg-primary/5 border-b">
              <div className="flex items-center gap-2 text-primary">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm font-medium">Refreshing invitations...</span>
              </div>
            </div>
          )}

          {invitations.length === 0 && !loading ? (
            <CardContent className="p-12">
              <div className="text-center space-y-6">
                <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto">
                  <UserPlus className="w-10 h-10 text-muted-foreground" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold">No invitations yet</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    You don't have any workspace invitations at the moment. Check back later or ask colleagues to invite you to their workspaces.
                  </p>
                </div>
                <Button onClick={fetchInvites} variant="outline">
                  <Mail className="w-4 h-4 mr-2" />
                  Check for invitations
                </Button>
              </div>
            </CardContent>
          ) : (
            <div className="divide-y">
              {/* Pending Invitations */}
              {pendingInvitations.length > 0 && (
                <div>
                  <div className="p-4 bg-amber-50/50">
                    <h3 className="font-semibold flex items-center gap-2">
                      <Clock className="w-4 h-4 text-amber-600" />
                      Pending Invitations
                      <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                        {pendingInvitations.length}
                      </Badge>
                    </h3>
                  </div>
                  {pendingInvitations.map((invite) => (
                    <div
                      key={invite.id}
                      className="p-6 hover:bg-muted/20 transition-colors duration-200"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                        {/* Workspace Info */}
                        <div className="flex-1">
                          <div className="flex items-start gap-4 mb-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg flex items-center justify-center flex-shrink-0">
                              <FileText className="w-5 h-5 text-primary" />
                            </div>
                            <div className="min-w-0">
                              <h4 className="text-lg font-semibold text-foreground mb-1">
                                {invite.space.title}
                              </h4>
                              <p className="text-sm text-muted-foreground mb-2">
                                You've been invited to collaborate on this workspace
                              </p>
                              <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                  {getStatusIcon(invite.status)}
                                  {getStatusBadge(invite.status)}
                                </div>
                                {invite.createdAt && (
                                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                    <Calendar className="w-3 h-3" />
                                    {formatDate(invite.createdAt)}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2 lg:flex-shrink-0">
                          <Button
                            onClick={() => handleAccept(invite.id)}
                            disabled={processingId === invite.id}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            {processingId === invite.id ? (
                              <Loader2 className="w-4 h-4 animate-spin mr-2" />
                            ) : (
                              <Check className="w-4 h-4 mr-2" />
                            )}
                            Accept
                          </Button>
                          
                          <Button
                            onClick={() => handleReject(invite.id)}
                            disabled={processingId === invite.id}
                            variant="destructive"
                          >
                            {processingId === invite.id ? (
                              <Loader2 className="w-4 h-4 animate-spin mr-2" />
                            ) : (
                              <X className="w-4 h-4 mr-2" />
                            )}
                            Reject
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Processed Invitations */}
              {processedInvitations.length > 0 && (
                <div>
                  {pendingInvitations.length > 0 && <Separator />}
                  <div className="p-4 bg-muted/30">
                    <h3 className="font-semibold flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-muted-foreground" />
                      Recent Activity
                      <Badge variant="outline">
                        {processedInvitations.length}
                      </Badge>
                    </h3>
                  </div>
                  {processedInvitations.map((invite) => (
                    <div
                      key={invite.id}
                      className="p-6 hover:bg-muted/10 transition-colors duration-200 opacity-75"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                          <FileText className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-foreground mb-1">
                            {invite.space.title}
                          </h4>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              {getStatusIcon(invite.status)}
                              {getStatusBadge(invite.status)}
                            </div>
                            {invite.createdAt && (
                              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <Calendar className="w-3 h-3" />
                                {formatDate(invite.createdAt)}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </Card>

        {/* Refresh Button */}
        {invitations.length > 0 && (
          <div className="mt-6 flex justify-center">
            <Button
              onClick={fetchInvites}
              disabled={loading}
              variant="outline"
              size="lg"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <RefreshCw className="w-4 h-4 mr-2" />
              )}
              Refresh invitations
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default InvitationsList;