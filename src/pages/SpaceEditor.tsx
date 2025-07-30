import { useEffect, useState, useRef, useCallback } from "react";
import { useParams } from "react-router-dom";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { useAuth } from "../store/auth";
import { io, Socket } from "socket.io-client";
import debounce from "lodash.debounce";

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
  const skipNextUpdate = useRef(false);
  const isFirstLoad = useRef(true);

  useEffect(() => {
    const fetchSpace = async () => {
      try {
        const res = await fetch(`http://localhost:3000/spaces/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch space");

        const data = await res.json();
        setSpace(data);
        if (data.ownerId === user.id) setOwner(true);
        setContent(data.content || "");
      } catch (err) {
        console.error("Error loading space:", err);
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

      fetch(`http://localhost:3000/spaces/${id}/content`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: newContent }),
      }).catch((err) => {
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

    socket.emit("spaceUpdate", {
      spaceId: id,
      content: newContent,
    });

    // Call debounced save
    debouncedSaveContent(newContent);
  };

  const handleInvite = async () => {
    setInviteStatus("");
    try {
      const res = await fetch(`http://localhost:3000/invites/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email: inviteEmail }),
      });

      if (!res.ok) throw new Error("Failed to invite user");
      setInviteStatus("User invited successfully.");
      setInviteEmail("");
    } catch (err) {
      console.error(err);
      setInviteStatus("Failed to invite user.");
    }
  };

  return (
    <div style={{ padding: "1rem" }}>
      {owner && (
        <div>
          <h4>Invite user by email</h4>
          <input
            type="email"
            placeholder="Enter user's email"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            style={{ padding: "0.5rem", width: "250px" }}
          />
          <button
            onClick={handleInvite}
            style={{ marginLeft: "1rem", padding: "0.5rem 1rem" }}
          >
            Invite
          </button>
          {inviteStatus && <p style={{ marginTop: "0.5rem" }}>{inviteStatus}</p>}
        </div>
      )}

      <h2>{space?.title ?? "Loading..."}</h2>

      <ReactQuill value={content} onChange={handleContentChange} />
    </div>
  );
};

export default SpaceEditor;
