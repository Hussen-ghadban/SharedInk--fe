import { useEffect, useState, useRef, useCallback } from "react";
import { useParams } from "react-router-dom";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { useAuth } from "../store/auth";
import { io, Socket } from "socket.io-client";
import debounce from "lodash.debounce";
import { Send, Users, FileText, Crown, Mail, Check, X, Loader2 } from "lucide-react";
import { getSpace, inviteUser, updateSpace } from "../api/space";

interface Space {
  id: string;
  title: string;
  content: string;
  ownerId: string;
  createdAt: string;
}

const socket: Socket = io("http://localhost:3000");

const SpaceEditor = () => {
  const { id } = useParams<{ id: string }>();
  const token = useAuth((state) => state.token);
  const user = useAuth((state) => state.user);
  const [space, setSpace] = useState<Space | null>(null);
  const [content, setContent] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteStatus, setInviteStatus] = useState("");
  const [owner, setOwner] = useState(false);
  const [isInviting, setIsInviting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const skipNextUpdate = useRef(false);
  const isFirstLoad = useRef(true);

  useEffect(() => {
    const fetchSpace = async () => {
      try {
        setIsLoading(true);
        const data = await getSpace(id,token);

        setSpace(data.data);
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

  // Debounced function to save content to backend
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-4 sm:p-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6 overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                    {space?.title ?? "Untitled Workspace"}
                  </h1>
                  {owner && (
                    <div className="flex items-center gap-1 mt-1">
                      <Crown className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm text-gray-600">You are the owner</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-2 bg-green-50 px-3 py-2 rounded-lg">
                <div className="p-1 bg-green-100 rounded">
                  <Users className="w-4 h-4 text-green-600" />
                </div>
                <span className="text-sm text-green-700 font-medium">Collaborative</span>
              </div>
            </div>
          </div>

          {/* Invitation Section */}
          {owner && (
            <div className="p-4 sm:p-6 bg-gradient-to-r from-blue-50 to-indigo-50">
              <div className="flex items-center gap-2 mb-4">
                <Mail className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">Invite Collaborators</h3>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <input
                    type="email"
                    placeholder="Enter collaborator's email address"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm bg-white shadow-sm"
                    disabled={isInviting}
                  />
                </div>
                
                <button
                  onClick={handleInvite}
                  disabled={isInviting || !inviteEmail.trim()}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium shadow-sm"
                >
                  {isInviting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Inviting...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send Invite
                    </>
                  )}
                </button>
              </div>

              {/* Status Messages */}
              {inviteStatus && (
                <div className="mt-4">
                  {inviteStatus === "success" && (
                    <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700">
                      <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                      <span className="font-medium">Invitation sent successfully!</span>
                    </div>
                  )}
                  
                  {inviteStatus === "error" && (
                    <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
                      <X className="w-5 h-5 text-red-600 flex-shrink-0" />
                      <span className="font-medium">Failed to send invitation. Please try again.</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Editor Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 sm:p-6">
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
                    ['clean']
                  ],
                }}
                formats={[
                  'header', 'bold', 'italic', 'underline', 'strike',
                  'blockquote', 'list', 'bullet', 'indent',
                  'link', 'image', 'color', 'background', 'code-block'
                ]}
              />
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .editor-container .ql-toolbar {
          border: 1px solid #e5e7eb;
          border-bottom: none;
          border-radius: 0.5rem 0.5rem 0 0;
          background: #f9fafb;
        }
        
        .editor-container .ql-container {
          border: 1px solid #e5e7eb;
          border-radius: 0 0 0.5rem 0.5rem;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }
        
        .editor-container .ql-editor {
          min-height: 300px;
          font-size: 16px;
          line-height: 1.6;
          padding: 1.5rem;
        }
        
        .editor-container .ql-editor.ql-blank::before {
          color: #9ca3af;
          font-style: normal;
        }
      `}</style>
    </div>
  );
};

export default SpaceEditor;