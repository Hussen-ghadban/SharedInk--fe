import { useNavigate, Navigate } from 'react-router-dom';
import { signup } from '../api/auth';
import { useAuth } from '../store/auth';
import { AuthForm } from '../components/AuthForm';

export default function SignUp() {
  const navigate = useNavigate();
  const { setToken, token } = useAuth();

  if (token) {
    return <Navigate to="/spaces" replace />;
  }

  const handleSubmit = async (data: { username: string ,email: string; password: string; }) => {
    const res = await signup(data);
    setToken(res.data.token);
    navigate('/spaces');
  };

  return <AuthForm onSubmit={handleSubmit} type="signup" />;
}