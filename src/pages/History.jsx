import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Music } from 'lucide-react';

export default function History() {
  const navigate = useNavigate();
  const [savedSongs, setSavedSongs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await fetch("https://emotion-music-backend-f06j.onrender.com/api/music/history", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        
        if (response.ok) {
          const data = await response.json();
          
          // --- BUG FIX: Scrub the data to remove old duplicates and broken songs ---
          const uniqueSongs = [];
          const seenIds = new Set();

          // We reverse it so your newest saves show up at the top
          for (const song of data.history.reverse()) {
            // Only keep it if it has a valid videoId AND we haven't seen it yet
            if (song.videoId && !seenIds.has(song.videoId)) {
              seenIds.add(song.videoId);
              uniqueSongs.push(song);
            }
          }
          
          setSavedSongs(uniqueSongs); 
        }
      } catch (error) {
        console.error("Failed to load history", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  // --- UPGRADE: Play the whole library starting from the clicked song ---
  const playSavedSong = (index) => {
    navigate('/playlist', {
      state: {
        emotion: "Your Library",
        playlist: savedSongs, // Pass the entire clean history
        startIndex: index     // Tell it which song to start on
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b0618] via-[#120a2a] to-[#1a0f3a] text-white p-6 md:p-12">
      <button onClick={() => navigate('/')} className="flex items-center gap-2 text-white/60 hover:text-white mb-8 transition-colors">
        <ArrowLeft size={20} /> Back to Home
      </button>

      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-400 to-purple-500 bg-clip-text text-transparent mb-2">
          Your Saved Tracks
        </h1>
        <p className="text-white/60 mb-10">All the songs that matched your vibe.</p>

        {loading ? (
          <div className="flex justify-center mt-20"><div className="w-10 h-10 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div></div>
        ) : savedSongs.length === 0 ? (
          <div className="text-center mt-20 bg-white/5 p-10 rounded-3xl border border-white/10">
            <Music size={48} className="mx-auto text-white/20 mb-4" />
            <h2 className="text-xl font-bold">Your library is empty</h2>
            <p className="text-white/50 mt-2">Go detect your mood and heart some songs!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedSongs.map((song, index) => (
              <div key={index} className="group bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 transition-all duration-300 shadow-lg flex items-center p-4 pr-6">
                
                {/* Thumbnail */}
                <div className="w-20 h-20 rounded-xl overflow-hidden relative shrink-0">
                  <img src={song.thumbnail} alt={song.title} className="w-full h-full object-cover" />
                  <div 
                    onClick={() => playSavedSong(index)} // Pass the index now!
                    className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer backdrop-blur-sm"
                  >
                    <Play className="fill-white text-white" size={24} />
                  </div>
                </div>

                {/* Info */}
                <div className="ml-4 flex-grow overflow-hidden">
                  <h3 className="font-bold text-white line-clamp-1 truncate" title={song.title}>{song.title}</h3>
                  <p className="text-pink-300 text-sm mt-1 truncate">{song.artist}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}