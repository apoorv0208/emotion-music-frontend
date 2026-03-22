import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('https://emotion-music-backend-f06j.onrender.com/api/auth/login', formData);
      
      if (response.status === 200) {
        // 1. Get the token and user data from the backend
        const { token, user } = response.data;

        // 2. Save them to the browser's Local Storage so the app remembers who is logged in
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));

        // 3. Redirect the user back to the home page!
        navigate('/'); 
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-6 text-pink-300">Welcome Back</h2>
        
        {error && <div className="bg-red-500/20 border border-red-500 text-red-100 p-3 rounded mb-4 text-center">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input type="email" name="email" required value={formData.email} onChange={handleChange}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 text-white placeholder-gray-300" 
              placeholder="john@example.com" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input type="password" name="password" required value={formData.password} onChange={handleChange}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 text-white" 
              placeholder="••••••••" />
          </div>

          <button type="submit" disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300 shadow-lg mt-4">
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-200">
          Don't have an account? <Link to="/register" className="text-blue-300 hover:text-blue-100 font-bold underline">Sign up here</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;