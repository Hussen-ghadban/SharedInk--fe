// src/components/AuthForm.tsx
import { useState } from 'react';

interface Props {
  onSubmit: (data: { email: string; password: string; username?: string }) => void;
  type: 'signin' | 'signup';
}

export const AuthForm = ({ onSubmit, type }: Props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ email, password, ...(type === 'signup' && { username }) });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>{type === 'signup' ? 'Sign Up' : 'Sign In'}</h2>
      {type === 'signup' && (
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      )}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">{type === 'signup' ? 'Sign Up' : 'Sign In'}</button>
    </form>
  );
};
