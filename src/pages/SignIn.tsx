import { useNavigate, Navigate } from 'react-router-dom';
import { signin } from '../api/auth';
import { useAuth } from '../store/auth';
import { AuthForm } from '../components/AuthForm';

export default function SignIn() {
  const navigate = useNavigate();
  const { setToken, token } = useAuth();

  if (token) {
    return <Navigate to="/spaces" replace />;
  }

  const handleSubmit = async (data: { email: string; password: string; username?: string }) => {
    const res = await signin(data);
    setToken(res.data.token);
    navigate('/spaces');
  };

  return <AuthForm onSubmit={handleSubmit} type="signin" />;
}
