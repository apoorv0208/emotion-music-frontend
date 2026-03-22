import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function Register() {
  const navigate = useNavigate();
  
  // Notice 'languages' is now an empty array []
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    age: '',
    languages: [] 
  });
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // List of available languages
  const availableLanguages = ["English", "Hindi", "Marathi", "Punjabi", "Tamil", "Telugu"];

  // Standard text inputs handler
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Special handler for checkboxes
  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    let updatedLanguages = [...formData.languages];

    if (checked) {
      // Add language if checked
      updatedLanguages.push(value);
    } else {
      // Remove language if unchecked
      updatedLanguages = updatedLanguages.filter((lang) => lang !== value);
    }

    setFormData({ ...formData, languages: updatedLanguages });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Quick validation: Ensure they picked at least one language
    if (formData.languages.length === 0) {
      setError("Please select at least one language.");
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.post('https://emotion-music-backend-f06j.onrender.com/api/auth/register', formData);
      if (response.status === 201) {
        alert('Registration Successful! Please login.');
        navigate('/login');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred during registration.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-6 text-pink-300">Create Account</h2>
        
        {error && <div className="bg-red-500/20 border border-red-500 text-red-100 p-3 rounded mb-4 text-center">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input type="text" name="name" required value={formData.name} onChange={handleChange}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 text-white placeholder-gray-300" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input type="email" name="email" required value={formData.email} onChange={handleChange}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 text-white placeholder-gray-300" />
          </div>

          <div className="flex gap-4">
             <div className="w-1/2">
                <label className="block text-sm font-medium mb-1">Password</label>
                <input type="password" name="password" required value={formData.password} onChange={handleChange}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 text-white" />
             </div>
             <div className="w-1/2">
                <label className="block text-sm font-medium mb-1">Age</label>
                <input type="number" name="age" required value={formData.age} onChange={handleChange} min="10" max="100"
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 text-white" />
             </div>
          </div>

          {/* New Multi-Select Checkbox Grid for Languages */}
          <div>
            <label className="block text-sm font-medium mb-2">Preferred Languages</label>
            <div className="grid grid-cols-3 gap-2">
              {availableLanguages.map((lang) => (
                <label key={lang} className="flex items-center space-x-2 text-sm cursor-pointer">
                  <input 
                    type="checkbox" 
                    value={lang} 
                    onChange={handleCheckboxChange}
                    checked={formData.languages.includes(lang)}
                    className="w-4 h-4 text-pink-500 bg-white/5 border-white/10 rounded focus:ring-pink-500 focus:ring-2"
                  />
                  <span>{lang}</span>
                </label>
              ))}
            </div>
          </div>

          <button type="submit" disabled={loading}
            className="w-full mt-6 bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300 shadow-lg">
            {loading ? 'Creating Profile...' : 'Sign Up'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-200">
          Already have an account? <Link to="/login" className="text-pink-300 hover:text-pink-100 font-bold underline">Login here</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;