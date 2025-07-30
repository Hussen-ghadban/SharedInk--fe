import { useNavigate } from 'react-router-dom';
import { AuthForm } from '../components/AuthForm';
import { signup } from '../api/auth';

export default function SignUp() {
  const navigate = useNavigate();

  const handleSubmit = async (data: any) => {
    try {
      const res = await signup(data);
      console.log("Signup success:", res.data);
      navigate('/signin'); // Redirect to login page
    } catch (err) {
      console.error("Signup failed:", err);
    }
  };

  return <AuthForm onSubmit={handleSubmit} type="signup" />;
}
