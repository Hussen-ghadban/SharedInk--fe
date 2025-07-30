import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
// import "react-quill/dist/quill.snow.css";
import { useAuth } from "../store/auth";

interface Space {
  id: string;
  title: string;
  content: string;
  ownerId: string;
  createdAt: string;
}

const SpaceEditor = () => {
  const { id } = useParams<{ id: string }>();
  const token = useAuth((state) => state.token);

  const [space, setSpace] = useState<Space | null>(null);
  const [content, setContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
const [inviteStatus, setInviteStatus] = useState("");


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
        setContent(data.content || "");
      } catch (err) {
        setMessage("Error loading space.");
        console.error(err);
      }
    };

    if (token && id) fetchSpace();
  }, [id, token]);

  const handleSave = async () => {
    if (!id) return;

    setIsSaving(true);
    setMessage("");

    try {
      const res = await fetch(`http://localhost:3000/spaces/${id}/content`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content }),
      });

      if (!res.ok) throw new Error("Failed to save content");

      setMessage("Content saved successfully.");
    } catch (err) {
      console.error(err);
      setMessage("Error saving content.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div style={{ padding: "1rem" }}>
        <div style={{ marginTop: "2rem" }}>
  <h4>Invite user by email</h4>
  <input
    type="email"
    placeholder="Enter user's email"
    value={inviteEmail}
    onChange={(e) => setInviteEmail(e.target.value)}
    style={{ padding: "0.5rem", width: "250px" }}
  />
  <button
    onClick={async () => {
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
    }}
    style={{ marginLeft: "1rem", padding: "0.5rem 1rem" }}
  >
    Invite
  </button>
  {inviteStatus && <p style={{ marginTop: "0.5rem" }}>{inviteStatus}</p>}
</div>

      <h2>{space?.title ?? "Loading..."}</h2>

      <ReactQuill value={content} onChange={setContent} />

      <button
        onClick={handleSave}
        disabled={isSaving}
        style={{ marginTop: "1rem", padding: "0.5rem 1rem" }}
      >
        {isSaving ? "Saving..." : "Save"}
      </button>

      {message && <p style={{ marginTop: "1rem" }}>{message}</p>}
    </div>
  );
};

export default SpaceEditor;
