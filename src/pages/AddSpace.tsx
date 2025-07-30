import { useState } from 'react';
import { addSpace } from '../api/space';
import { useAuth } from '../store/auth';

const AddSpace = () => {
    const token = useAuth((state) => state.token);
    console.log("token",token)
  const [title, setTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleAddSpace = async () => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
        if (!token) throw new Error('Unauthorized: No token found');
      const res = await addSpace({title},token);
      console.log('Space added:', res.data);
      setTitle('');
      setSuccess(true);
    } catch (err: any) {
      console.error('Add space error:', err);
      setError(err.message || 'Failed to add space');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <input
        type="text"
        value={title}
        placeholder="Enter space title"
        onChange={(e) => setTitle(e.target.value)}
      />
      <button onClick={handleAddSpace} disabled={isLoading || !title}>
        {isLoading ? 'Adding...' : 'Add Space'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>Space added successfully!</p>}
    </div>
  );
};

export default AddSpace
