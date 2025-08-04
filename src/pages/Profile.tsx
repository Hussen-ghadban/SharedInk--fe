import { useEffect, useRef, useState } from "react";
import { useAuth } from "../store/auth";
import { getuser, uploadProfileImage } from "../api/auth";
import { Camera, Upload, User, Mail, Hash, AlertTriangle, CheckCircle, X, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from '../components/ui/alert';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { Progress } from '../components/ui/progress';
import { Label } from "../components/ui/label";

interface User {
  id: string;
  email: string;
  username: string;
  profile: string;
}

interface ProfileError {
  message: string;
  type: 'fetch' | 'upload';
}

const Profile = () => {
  const { token } = useAuth();
  const inputRef = useRef<HTMLInputElement>(null);
  const [user, setUser] = useState<User | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ProfileError | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      
      try {
        setError(null);
        const response = await getuser(token);
        setUser(response.data);
      } catch (err: any) {
        console.error("Failed to fetch user:", err);
        setError({
          message: err.response?.data?.message || "Failed to load user data",
          type: 'fetch'
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchUser();
  }, [token]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !token) return;

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError({
        message: "Please select a valid image file (JPEG, PNG, or WebP)",
        type: 'upload'
      });
      return;
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setError({
        message: "File size must be less than 5MB",
        type: 'upload'
      });
      return;
    }

    setError(null);
    setUploadSuccess(false);
    setPreviewUrl(URL.createObjectURL(file));
    
    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploading(true);
      setUploadProgress(0);
      
      // Simulate progress for demo
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 100);

      const response = await uploadProfileImage(formData, token);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      const newImageUrl = response.data.secure_url;
      setUser((prev) => prev ? { ...prev, profile: newImageUrl } : null);
      
      // Clear preview after successful upload
      setPreviewUrl(null);
      setUploadSuccess(true);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setUploadSuccess(false);
      }, 3000);
      
      setError(null);
    } catch (error: any) {
      console.error("Image upload failed:", error);
      setError({
        message: error.response?.data?.message || "Failed to upload image",
        type: 'upload'
      });
      setPreviewUrl(null);
    } finally {
      setUploading(false);
      setUploadProgress(0);
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    }
  };

  const handleImageClick = () => {
    inputRef.current?.click();
  };

  const clearError = () => {
    setError(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="p-8">
            <div className="flex flex-col items-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              <div className="space-y-2 text-center">
                <div className="h-4 bg-muted rounded animate-pulse w-32"></div>
                <div className="h-3 bg-muted rounded animate-pulse w-24"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <Card className="w-full max-w-md mx-4 border-amber-200 bg-amber-50">
          <CardContent className="p-8 text-center">
            <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-amber-800 mb-2">Authentication Required</h3>
            <p className="text-amber-700">Please log in to view your profile.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error?.type === 'fetch') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <Card className="w-full max-w-md mx-4 border-red-200 bg-red-50">
          <CardContent className="p-8 text-center">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-red-800 mb-2">Failed to Load Profile</h3>
            <p className="text-red-700 mb-4">{error.message}</p>
            <Button onClick={() => window.location.reload()} variant="outline">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="p-8 text-center">
            <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No user data available.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-foreground">My Profile</h1>
            <p className="text-muted-foreground mt-2">Manage your account settings and preferences</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-8">
          {/* Success Alert */}
          {uploadSuccess && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Profile picture updated successfully!
              </AlertDescription>
            </Alert>
          )}

          {/* Error Alert */}
          {error?.type === 'upload' && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="flex items-center justify-between">
                <span>{error.message}</span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={clearError}
                  className="h-auto p-1 text-destructive hover:text-destructive/80"
                >
                  <X className="h-4 w-4" />
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {/* Profile Card */}
          <Card className="shadow-lg border-0 bg-white/60 backdrop-blur-sm">
            <CardHeader className="pb-6">
              <CardTitle className="text-2xl flex items-center gap-2">
                <User className="h-6 w-6 text-primary" />
                Profile Information
              </CardTitle>
              <CardDescription>
                Your account details and profile picture
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-8">
              {/* Profile Picture Section */}
              <div className="flex flex-col items-center space-y-6">
                <div className="relative group">
                  <Avatar className="h-32 w-32 border-4 border-background shadow-lg">
                    <AvatarImage 
                      src={previewUrl || user.profile} 
                      alt={`${user.username}'s profile`}
                      className="object-cover"
                    />
                    <AvatarFallback className="text-2xl font-semibold bg-primary/10 text-primary">
                      {user.username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  
                  {/* Upload overlay */}
                  <div 
                    className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    onClick={handleImageClick}
                  >
                    <Camera className="h-8 w-8 text-white" />
                  </div>
                  
                  {/* Loading overlay */}
                  {uploading && (
                    <div className="absolute inset-0 bg-black/70 rounded-full flex items-center justify-center">
                      <Loader2 className="h-8 w-8 text-white animate-spin" />
                    </div>
                  )}
                </div>

                {/* Upload Progress */}
                {uploading && (
                  <div className="w-full max-w-xs space-y-2">
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Uploading...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} className="h-2" />
                  </div>
                )}

                {/* Upload Button */}
                <Button 
                  onClick={handleImageClick}
                  disabled={uploading}
                  className="min-w-[200px]"
                  size="lg"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Change Profile Picture
                    </>
                  )}
                </Button>

                <p className="text-xs text-muted-foreground text-center max-w-xs">
                  Supported formats: JPEG, PNG, WebP • Maximum file size: 5MB
                </p>
              </div>

              <Separator />

              {/* User Information */}
              <div className="grid gap-6 md:grid-cols-1">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <Label className="text-sm font-medium text-muted-foreground">Username</Label>
                      <p className="font-semibold">{user.username}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Mail className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <Label className="text-sm font-medium text-muted-foreground">Email Address</Label>
                      <p className="font-semibold">{user.email}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Actions Card */}
          <Card className="shadow-lg border-0 bg-white/60 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl">Account Actions</CardTitle>
              <CardDescription>
                Additional settings and preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <Button variant="outline" className="justify-start h-auto p-4">
                  <div className="text-left">
                    <div className="font-medium">Edit Profile</div>
                    <div className="text-sm text-muted-foreground">Update your personal information</div>
                  </div>
                </Button>
                <Button variant="outline" className="justify-start h-auto p-4">
                  <div className="text-left">
                    <div className="font-medium">Privacy Settings</div>
                    <div className="text-sm text-muted-foreground">Manage your privacy preferences</div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        className="hidden"
        onChange={handleFileChange}
        disabled={uploading}
      />
    </div>
  );
};

export default Profile;