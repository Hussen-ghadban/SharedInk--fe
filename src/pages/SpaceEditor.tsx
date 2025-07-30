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
