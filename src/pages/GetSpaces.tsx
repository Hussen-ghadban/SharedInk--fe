import { useEffect, useState } from "react";
import { getSpaces } from "../api/space";
import { useAuth } from "../store/auth";
import { Link } from "react-router-dom";

interface Space {
  id: string;
  title: string;
  content: string;
  ownerId: string;
  createdAt: string;
}

const GetSpaces = () => {
  const token = useAuth((state) => state.token);

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
        console.log("data",data)
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

  if (isLoading) return <div>Loading spaces...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Your Spaces</h2>
      {spaces.length === 0 ? (
        <p>No spaces found.</p>
      ) : (
        <ul>
          {spaces.map((space) => (
            <li key={space.id} style={{ marginBottom: "1rem" }}>
              <h3>
                <Link to={`/spaces/${space.id}`} style={{ textDecoration: 'none', color: 'blue' }}>
                    {space.title}
                </Link>
              </h3>
              <p><strong>Owner ID:</strong> {space.ownerId}</p>
              <p><strong>Created At:</strong> {new Date(space.createdAt).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default GetSpaces;
