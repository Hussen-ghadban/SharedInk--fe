// src/pages/SignIn.tsx
import { signin } from '../api/auth';
import { useAuth } from '../store/auth';
import { AuthForm } from '../components/AuthForm';

export default function SignIn() {
  const setToken = useAuth((state) => state.setToken);

  const handleSubmit = async (data: any) => {
    const res = await signin(data);
    setToken(res.data.token);
  };

  return <AuthForm onSubmit={handleSubmit} type="signin" />;
}
