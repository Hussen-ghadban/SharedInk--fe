// src/components/AuthForm.tsx
import { useState } from 'react';
import { Link } from 'react-router-dom';

interface Props {
  onSubmit: (data: {  username: string ,email: string; password: string;}) => Promise<void>;
  type: 'signin' | 'signup';
}

export const AuthForm = ({ onSubmit, type }: Props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError(null);

  if (!email || !password || (type === 'signup' && !username)) {
    setError('Please fill in all fields');
    return;
  }

  setLoading(true);

  try {
    await onSubmit({ username, email, password }); // always include username
  } catch (err: any) {
    setError(err.response?.data?.message || 'An error occurred. Please try again.');
  } finally {
    setLoading(false);
  }
};


  const handleInputChange = (setter: (value: string) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setter(e.target.value);
    if (error) setError(null);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 underline">
            {type === 'signup' ? 'Sign Up' : 'Sign In'}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {type === 'signup' ? (
              <>
                Already have an account?{' '}
                <Link to="/signin" className="font-medium text-indigo-600 hover:text-indigo-500">
                  Sign in
                </Link>
              </>
            ) : (
              <>
                Don't have an account?{' '}
                <Link to="/signup" className="font-medium text-indigo-600 hover:text-indigo-500">
                  Sign up
                </Link>
              </>
            )}
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            {type === 'signup' && (
              <div>
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={handleInputChange(setUsername)}
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  required
                />
              </div>
            )}
            
            <div>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={handleInputChange(setEmail)}
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                required
              />
            </div>
            
            <div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={handleInputChange(setPassword)}
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                required
              />
            </div>
          </div>

          <div>

<button
  type="submit"
  disabled={loading}
 className="w-full flex justify-center py-2 px-4 rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"

>
  {loading ? 'Loading...' : (type === 'signup' ? 'Sign Up' : 'Sign In')}
</button>

          </div>
          
          <div className="text-center">
            <Link 
              to="/" 
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              ← Back to home
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};