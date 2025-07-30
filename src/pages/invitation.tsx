import React, { useEffect, useState } from 'react';
import { getInvitations, acceptInvitation, rejectInvitation } from '../api/invitation';
import { useAuth } from '../store/auth';

interface Invitation {
  id: string;
  email: string;
  status: string;
  space: {
    title: string;
  };
}



const InvitationsList: React.FC = () => {
      const token = useAuth((state) => state.token);
    
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchInvites = async () => {
    setLoading(true);
    try {
      const response = await getInvitations(token!);
      setInvitations(response.data);
    } catch (error) {
      console.error('Failed to fetch invitations:', error);
    }
    setLoading(false);
  };

  const handleAccept = async (id: string) => {
    try {
      await acceptInvitation(id, token!);
      fetchInvites(); // Refresh list
    } catch (error) {
      console.error('Failed to accept invitation:', error);
    }
  };

  const handleReject = async (id: string) => {
    try {
      await rejectInvitation(id, token!);
      fetchInvites(); // Refresh list
    } catch (error) {
      console.error('Failed to reject invitation:', error);
    }
  };

  useEffect(() => {
    fetchInvites();
  }, []);

  return (
    <div>
      <h2>My Invitations</h2>
      {loading ? (
        <p>Loading...</p>
      ) : invitations.length === 0 ? (
        <p>No invitations found.</p>
      ) : (
        <ul>
          {invitations.map((invite) => (
            <li key={invite.id}>
              <strong>{invite.space.title}</strong> — {invite.status}
              {invite.status === 'PENDING' && (
                <>
                  <button onClick={() => handleAccept(invite.id)}>Accept</button>
                  <button onClick={() => handleReject(invite.id)}>Reject</button>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default InvitationsList;
