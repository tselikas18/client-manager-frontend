import {useState} from "react";
import {useNavigate} from "react-router";
import "../App.css";
import {useAuth} from "../context/auth.ts";

type AuthResult = { success: true } | { success: false; error: string };

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = (await (isLogin
        ? login(formData.email, formData.password)
        : register(formData.name, formData.email, formData.password))) as AuthResult;

    if (result.success) {
      navigate('/clients');
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              {isLogin ? 'Sign in to your account' : 'Create new account'}
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Manage your business debts and credits
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm -space-y-px">
              {!isLogin && (
                  <div>
                    <input
                        name="name"
                        type="text"
                        required={!isLogin}
                        value={formData.name}
                        onChange={handleChange}
                        className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                        placeholder="Full name"
                    />
                  </div>
              )}
              <div>
                <input
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className={`appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 ${
                        isLogin ? 'rounded-t-md' : ''
                    } focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                    placeholder="Email address"
                />
              </div>
              <div>
                <input
                    name="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="Password"
                />
              </div>
            </div>

            {error && (
                <div className="text-red-600 text-sm text-center">{error}</div>
            )}

            <div>
              <button
                  type="submit"
                  disabled={loading}
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {loading ? 'Processing...' : isLogin ? 'Sign in' : 'Sign up'}
              </button>
            </div>

            <div className="text-center">
              <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                {isLogin ? 'Need an account? Sign up' : 'Already have an account? Sign in'}
              </button>
            </div>
          </form>
        </div>
      </div>
  );
};

export default LoginPage;