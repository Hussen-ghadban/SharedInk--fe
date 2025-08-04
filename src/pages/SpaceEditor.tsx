import { useEffect, useState, useRef, useCallback } from "react";
import { useParams } from "react-router-dom";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { useAuth } from "../store/auth";
import { io, Socket } from "socket.io-client";
import debounce from "lodash.debounce";
import { 
  Send, 
  Users, 
  FileText, 
  Crown, 
  Mail, 
  Check, 
  X, 
  Loader2, 
  UserCircle,
  ChevronDown,
  ChevronUp,
  Copy,
  Settings,
  Shield
} from "lucide-react";
import { getSpace, inviteUser, updateSpace } from "../api/space";
import { baseUrl } from "../config";

interface Space {
  id: string;
  title: string;
  content: string;
  ownerId: string;
  createdAt: string;
}

interface collaborators{
  id:string;
  username:string;
  email:string;
}

const socket: Socket = io(baseUrl);

const SpaceEditor = () => {
  const { id } = useParams<{ id: string }>();
  const token = useAuth((state) => state.token);
  const user = useAuth((state) => state.user);
  const [space, setSpace] = useState<Space | null>(null);
  const [content, setContent] = useState("");
  const [collaborators, setCollaborators] = useState<collaborators[]>([]);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteStatus, setInviteStatus] = useState("");
  const [owner, setOwner] = useState(false);
  const [isInviting, setIsInviting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showCollaborators, setShowCollaborators] = useState(false);
  const [showInvitePanel, setShowInvitePanel] = useState(false);
  const skipNextUpdate = useRef(false);
  const isFirstLoad = useRef(true);

  useEffect(() => {
    const fetchSpace = async () => {
      try {
        setIsLoading(true);
        const data = await getSpace(id, token);
        console.log("data", data);
        setSpace(data.data);
        if (data.data.collaborators) {
          setCollaborators(data.data.collaborators);
        }
        if (data.data.ownerId === user.id) setOwner(true);
        setContent(data.data.content || "");
      } catch (err) {
        console.error("Error loading space:", err);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (id && token) fetchSpace();
  }, [id, token, user.id]);
  
  useEffect(() => {
    if (id) {
      socket.emit("joinSpace", id);

      socket.on("spaceUpdated", ({ content: newContent }) => {
        skipNextUpdate.current = true;
        setContent(newContent);
      });

      return () => {
        socket.off("spaceUpdated");
      };
    }
  }, [id]);

  const debouncedSaveContent = useCallback(
    debounce((newContent: string) => {
      if (!id || !token) return;

      updateSpace(id, newContent, token).catch((err) => {
        console.error("Failed to save content", err);
      });
    }, 500),
    [id, token]
  );

  const handleContentChange = (newContent: string) => {
    setContent(newContent);

    if (isFirstLoad.current) {
      isFirstLoad.current = false;
      return;
    }

    if (skipNextUpdate.current) {
      skipNextUpdate.current = false;
      return;
    }
    debouncedSaveContent(newContent);
  };

  const handleInvite = async () => {
    if (!inviteEmail.trim()) return;

    setInviteStatus("");
    setIsInviting(true);

    try {
      await inviteUser(id, inviteEmail, token);
      setInviteStatus("success");
      setInviteEmail("");
      setTimeout(() => setInviteStatus(""), 3000);
    } catch (err) {
      console.error(err);
      setInviteStatus("error");
      setTimeout(() => setInviteStatus(""), 5000);
    } finally {
      setIsInviting(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isInviting) {
      handleInvite();
    }
  };

  const getInitials = (email: string, username?: string) => {
    if (username) {
      return username.substring(0, 2).toUpperCase();
    }
    return email.substring(0, 2).toUpperCase();
  };

  const getAvatarColor = (email: string) => {
    const colors = [
      'bg-blue-500',
      'bg-green-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-yellow-500',
      'bg-red-500',
      'bg-teal-500'
    ];
    const index = email.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const copySpaceLink = () => {
    navigator.clipboard.writeText(window.location.href);
    // You could add a toast notification here
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <FileText className="w-6 h-6 text-blue-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          <p className="text-gray-600 font-medium">Loading workspace...</p>
          <p className="text-gray-400 text-sm mt-1">Setting up your collaborative environment</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        {/* Enhanced Header */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 mb-6 overflow-hidden">
          <div className="p-6 sm:p-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              {/* Title Section */}
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                    <FileText className="w-7 h-7 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
                    {space?.title ?? "Untitled Workspace"}
                  </h1>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    {owner && (
                      <div className="flex items-center gap-1 px-2 py-1 bg-yellow-100 rounded-full">
                        <Crown className="w-3 h-3 text-yellow-600" />
                        <span className="text-yellow-700 font-medium">Owner</span>
                      </div>
                    )}
                    <span>Created {space?.createdAt ? new Date(space.createdAt).toLocaleDateString() : 'Recently'}</span>
                  </div>
                </div>
              </div>

              {/* Actions and Collaborators */}
              <div className="flex items-center gap-4">
                {/* Collaborators Preview */}
                <div className="relative">
                  <button
                    onClick={() => setShowCollaborators(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-white/70 hover:bg-white/90 border border-gray-200 rounded-xl transition-all duration-200 shadow-sm"
                  >
                    <div className="flex -space-x-2">
                      {collaborators.slice(0, 3).map((collaborator, index) => (
                        <div
                          key={collaborator.id}
                          className={`w-8 h-8 rounded-full ${getAvatarColor(collaborator.email)} flex items-center justify-center text-white text-xs font-semibold border-2 border-white shadow-sm`}
                          style={{ zIndex: 10 - index }}
                        >
                          {getInitials(collaborator.email, collaborator.username)}
                        </div>
                      ))}
                      {collaborators.length > 3 && (
                        <div className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center text-white text-xs font-semibold border-2 border-white shadow-sm">
                          +{collaborators.length - 3}
                        </div>
                      )}
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      {collaborators.length} {collaborators.length === 1 ? 'member' : 'members'}
                    </span>
                    <Users className="w-4 h-4 text-gray-500" />
                  </button>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={copySpaceLink}
                    className="p-2 bg-white/70 hover:bg-white/90 border border-gray-200 rounded-xl transition-all duration-200 shadow-sm"
                    title="Copy workspace link"
                  >
                    <Copy className="w-4 h-4 text-gray-600" />
                  </button>
                  
                  {owner && (
                    <button
                      onClick={() => setShowInvitePanel(!showInvitePanel)}
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg font-medium"
                    >
                      <Mail className="w-4 h-4" />
                      Invite
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Invitation Panel */}
          {owner && showInvitePanel && (
            <div className="border-t border-gray-100 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 p-6">
              <div className="max-w-2xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Mail className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Invite Team Members</h3>
                    <p className="text-sm text-gray-600">Add collaborators to work together on this workspace</p>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1 relative">
                    <input
                      type="email"
                      placeholder="Enter email address (e.g., colleague@company.com)"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="w-full px-4 py-3 pl-12 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm bg-white/80 backdrop-blur-sm shadow-sm"
                      disabled={isInviting}
                    />
                    <Mail className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
                  </div>
                  
                  <button
                    onClick={handleInvite}
                    disabled={isInviting || !inviteEmail.trim()}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium shadow-lg min-w-[140px]"
                  >
                    {isInviting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Send Invite
                      </>
                    )}
                  </button>
                </div>

                {/* Enhanced Status Messages */}
                {inviteStatus && (
                  <div className="mt-4">
                    {inviteStatus === "success" && (
                      <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700">
                        <div className="p-1 bg-green-100 rounded-full">
                          <Check className="w-4 h-4 text-green-600" />
                        </div>
                        <div>
                          <p className="font-semibold">Invitation sent successfully!</p>
                          <p className="text-sm text-green-600">They'll receive an email with access instructions.</p>
                        </div>
                      </div>
                    )}
                    
                    {inviteStatus === "error" && (
                      <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
                        <div className="p-1 bg-red-100 rounded-full">
                          <X className="w-4 h-4 text-red-600" />
                        </div>
                        <div>
                          <p className="font-semibold">Failed to send invitation</p>
                          <p className="text-sm text-red-600">Please check the email address and try again.</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Enhanced Editor Section */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 overflow-hidden">
          <div className="p-6 sm:p-8">
            <div className="editor-container">
              <ReactQuill 
                value={content} 
                onChange={handleContentChange}
                className="min-h-96 prose-editor"
                theme="snow"
                modules={{
                  toolbar: [
                    [{ 'header': [1, 2, 3, false] }],
                    ['bold', 'italic', 'underline', 'strike'],
                    ['blockquote', 'code-block'],
                    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                    [{ 'indent': '-1'}, { 'indent': '+1' }],
                    ['link', 'image'],
                    [{ 'color': [] }, { 'background': [] }],
                    [{ 'align': [] }],
                    ['clean']
                  ],
                }}
                formats={[
                  'header', 'bold', 'italic', 'underline', 'strike',
                  'blockquote', 'list', 'bullet', 'indent',
                  'link', 'image', 'color', 'background', 'code-block', 'align'
                ]}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Collaborators Dialog/Modal */}
      {showCollaborators && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setShowCollaborators(false)}
          />
          
          {/* Dialog Content */}
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[80vh] overflow-hidden transform transition-all duration-300 scale-100">
            {/* Header */}
            <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Team Members</h2>
                    <p className="text-sm text-gray-600">
                      {collaborators.length} {collaborators.length === 1 ? 'member' : 'members'} in this workspace
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowCollaborators(false)}
                  className="p-2 hover:bg-white/80 rounded-lg transition-colors duration-200"
                >
                    <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="max-h-96 overflow-y-auto">
              {collaborators.length > 0 ? (
                <div className="p-2">
                  {collaborators.map((collaborator, index) => (
                    <div key={collaborator.id} className="p-4 hover:bg-gray-50 rounded-xl m-2 transition-colors duration-150 group">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-full ${getAvatarColor(collaborator.email)} flex items-center justify-center text-white font-bold shadow-md group-hover:shadow-lg transition-shadow duration-200`}>
                          {getInitials(collaborator.email, collaborator.username)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-gray-900 truncate">
                              {collaborator.username || collaborator.email.split('@')[0]}
                            </p>
                            {collaborator.id === space?.ownerId && (
                              <div className="flex items-center gap-1 px-2 py-1 bg-yellow-100 rounded-full">
                                <Crown className="w-3 h-3 text-yellow-600" />
                                <span className="text-xs text-yellow-700 font-medium">Owner</span>
                              </div>
                            )}
                          </div>
                          <p className="text-sm text-gray-500 truncate mt-1">{collaborator.email}</p>
                          <p className="text-xs text-gray-400 mt-1">
                            {collaborator.id === space?.ownerId ? 'Workspace creator' : 'Collaborator'}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {collaborator.id === user?.id && (
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
                              You
                            </span>
                          )}
                          <div className="w-2 h-2 bg-green-500 rounded-full" title="Online" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No collaborators yet</h3>
                  <p className="text-gray-500 mb-4">Invite team members to start collaborating on this workspace.</p>
                  {owner && (
                    <button
                      onClick={() => {
                        setShowCollaborators(false);
                        setShowInvitePanel(true);
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
                    >
                      Invite Members
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            {collaborators.length > 0 && (
              <div className="p-4 border-t border-gray-100 bg-gray-50">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">
                    Everyone can edit and collaborate in real-time
                  </p>
                  {owner && (
                    <button
                      onClick={() => {
                        setShowCollaborators(false);
                        setShowInvitePanel(true);
                      }}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
                    >
                      Invite more
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        .editor-container .ql-toolbar {
          border: 1px solid #e5e7eb;
          border-bottom: none;
          border-radius: 0.75rem 0.75rem 0 0;
          background: linear-gradient(to right, #f8fafc, #f1f5f9);
          backdrop-filter: blur(10px);
        }
        
        .editor-container .ql-container {
          border: 1px solid #e5e7eb;
          border-radius: 0 0 0.75rem 0.75rem;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(10px);
        }
        
        .editor-container .ql-editor {
          min-height: 400px;
          font-size: 16px;
          line-height: 1.7;
          padding: 2rem;
          color: #1f2937;
        }
        
        .editor-container .ql-editor.ql-blank::before {
          color: #9ca3af;
          font-style: normal;
          font-size: 16px;
          content: 'Start writing your collaborative document here...';
        }

        .editor-container .ql-toolbar .ql-formats {
          margin-right: 15px;
        }

        .editor-container .ql-toolbar button:hover {
          color: #3b82f6;
        }

        .editor-container .ql-toolbar button.ql-active {
          color: #3b82f6;
        }
      `}</style>
    </div>
  );
};

export default SpaceEditor;