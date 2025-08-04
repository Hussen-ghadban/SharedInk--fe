import { useEffect, useState } from "react";
import { getSpaces } from "../api/space";
import { useAuth } from "../store/auth";
import { Link } from "react-router-dom";
import { Plus, Calendar, User, FileText, Loader2, RefreshCw } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Separator } from "../components/ui/separator";
import { Alert, AlertDescription } from "../components/ui/alert";
import { Badge } from "../components/ui/badge";

interface Space {
  id: string;
  title: string;
  content: string;
  ownerId: string;
  owner: {
    username: string;
  };
  createdAt: string;
}

const GetSpaces = () => {
  const { token, user } = useAuth();

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

  const handleRetry = () => {
    setError(null);
    setIsLoading(true);
    // Re-trigger the effect by updating a dependency or call fetchSpaces directly
    window.location.reload();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Loading your spaces</h3>
            <p className="text-muted-foreground">Please wait while we fetch your data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-destructive">Something went wrong</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
            <Button onClick={handleRetry} className="w-full">
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const ownedSpaces = spaces.filter(space => space.ownerId === user?.id);
  const sharedSpaces = spaces.length - ownedSpaces.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="space-y-1">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
                Your Spaces
              </h1>
              <p className="text-muted-foreground">
                Welcome back{user?.email && `, ${user.email}`}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button asChild variant="outline">
                <Link to="/invites">
                  <FileText className="w-4 h-4 mr-2" />
                  Invitations
                </Link>
              </Button>
              <Button asChild>
                <Link to="/addSpace">
                  <Plus className="w-4 h-4 mr-2" />
                  New Space
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {spaces.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Card className="w-full max-w-md text-center">
              <CardHeader className="pb-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="text-xl">No spaces yet</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Get started by creating your first collaborative space.
                </p>
                <Button asChild size="lg" className="w-full">
                  <Link to="/addSpace">
                    <Plus className="w-5 h-5 mr-2" />
                    Create Your First Space
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="border-l-4 border-l-primary">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Spaces</p>
                      <p className="text-3xl font-bold text-primary">{spaces.length}</p>
                    </div>
                    <FileText className="h-8 w-8 text-primary/60" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-l-4 border-l-green-500">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Owned by You</p>
                      <p className="text-3xl font-bold text-green-600">{ownedSpaces.length}</p>
                    </div>
                    <User className="h-8 w-8 text-green-500/60" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-blue-500">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Shared with You</p>
                      <p className="text-3xl font-bold text-blue-600">{sharedSpaces}</p>
                    </div>
                    <FileText className="h-8 w-8 text-blue-500/60" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Spaces Grid */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">All Spaces</h2>
                <Badge variant="secondary" className="text-sm">
                  {spaces.length} {spaces.length === 1 ? 'space' : 'spaces'}
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {spaces.map((space) => (
                  <Card 
                    key={space.id} 
                    className="group hover:shadow-lg transition-all duration-200 hover:-translate-y-1 border-0 shadow-md"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg group-hover:text-primary transition-colors line-clamp-2">
                          <Link
                            to={`/spaces/${space.id}`}
                            className="hover:underline"
                          >
                            {space.title}
                          </Link>
                        </CardTitle>
                        {space.ownerId === user?.id && (
                          <Badge variant="outline" className="ml-2 text-xs">
                            Owner
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    
                    <CardContent className="pt-0">
                      <div className="space-y-3">
                        <Separator />
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            <span className="font-medium">{space.owner.username}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>{new Date(space.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    
                    <CardFooter className="pt-0">
                      <Button asChild variant="ghost" className="w-full justify-start p-0 h-auto">
                        <Link
                          to={`/spaces/${space.id}`}
                          className="font-medium text-primary hover:text-primary/80"
                        >
                          Open space →
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default GetSpaces;