import { Link, useNavigate } from 'react-router-dom';
import { Brain, Heart, Sparkles, Music, LogOut, User } from 'lucide-react'; // Added LogOut and User icons

function Home() {
  const navigate = useNavigate();
  
  // 1. Check if user is logged in by looking for their data in localStorage
  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : null;

  // 2. Logout function
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login'); // Send them back to login after logging out
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative">
      
      {/* --- NEW: Top Navigation Bar --- */}
      <div className="absolute top-0 w-full p-6 flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center gap-2 text-xl font-bold text-white">
          <Music className="w-6 h-6 text-pink-400" />
          <span>VibeSync</span> {/* Feel free to change the app name! */}
        </div>

        <div>
          {user ? (
            // If logged in, show their name and logout button
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-pink-200">
                <User className="w-5 h-5" />
                <span>Welcome, <strong>{user.name}</strong></span>
              </div>
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg backdrop-blur-md transition-colors border border-white/20"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            // If NOT logged in, show Login and Register buttons
            <div className="flex items-center gap-4">
              <Link to="/login" className="text-white hover:text-pink-300 font-medium transition-colors">Login</Link>
              <Link to="/register" className="bg-pink-500 hover:bg-pink-600 text-white px-5 py-2 rounded-lg font-medium transition-colors shadow-lg">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
      {/* --- END NEW Top Navigation Bar --- */}


      {/* Your Original Beautiful Landing Page UI */}
      <div className="text-center mb-16 mt-20">
        <div className="bg-white/10 p-4 rounded-full inline-block mb-6 shadow-lg border border-white/20 backdrop-blur-sm">
          <Music className="w-8 h-8 text-pink-300" />
        </div>
        <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-purple-300 drop-shadow-sm">
          Emotion-Based<br />Music Recommendation
        </h1>
        <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto font-light">
          Detect your mood through facial expressions and receive music that matches or uplifts your emotions.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl w-full">
        <Link to="/detect" className="group bg-white/10 hover:bg-white/20 backdrop-blur-lg border border-white/20 p-8 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-pink-500/20 flex flex-col items-center text-center cursor-pointer">
          <Brain className="w-12 h-12 mb-4 text-pink-400 group-hover:scale-110 transition-transform" />
          <h2 className="text-2xl font-bold mb-2">AI Detection</h2>
          <p className="text-blue-100/80 text-sm">Advanced facial emotion recognition</p>
        </Link>

        <Link to="/history" className="group bg-white/10 hover:bg-white/20 backdrop-blur-lg border border-white/20 p-8 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20 flex flex-col items-center text-center cursor-pointer">
          <Heart className="w-12 h-12 mb-4 text-purple-400 group-hover:scale-110 transition-transform" />
          <h2 className="text-2xl font-bold mb-2">Playlist</h2>
          <p className="text-blue-100/80 text-sm">Previously played music</p>
        </Link>

        <Link to="/instant" className="group bg-white/10 hover:bg-white/20 backdrop-blur-lg border border-white/20 p-8 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20 flex flex-col items-center text-center cursor-pointer">
          <Sparkles className="w-12 h-12 mb-4 text-blue-400 group-hover:scale-110 transition-transform" />
          <h2 className="text-2xl font-bold mb-2">Instant Play</h2>
          <p className="text-blue-100/80 text-sm">Seamless listening experience</p>
        </Link>
      </div>
    </div>
  );
}

export default Home;