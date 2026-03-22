import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Music, Disc3, SkipBack, SkipForward, Heart, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import YouTube from 'react-youtube';

export default function Playlist() {
  const location = useLocation();
  const navigate = useNavigate();

  // 1. Extract the new startIndex
  const { emotion, playlist: initialPlaylist, startIndex } = location.state || {};
  
  const [currentPlaylist, setCurrentPlaylist] = useState(initialPlaylist || []);
  
  // 2. Start the player at the specific index clicked in History
  const [currentIndex, setCurrentIndex] = useState(startIndex || 0);
  
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [savedStatus, setSavedStatus] = useState('');
  const [savedVideoIds, setSavedVideoIds] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      try {
        const response = await fetch("https://emotion-music-backend-f06j.onrender.com/api/music/history", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setSavedVideoIds(data.savedVideoIds || []);
        }
      } catch (error) {
        console.error("Failed to load history", error);
      }
    };
    fetchHistory();
  }, []);

  // 3. CRASH PROTECTION: Use optional chaining (?.) so React never crashes if data is missing
  const currentSong = currentPlaylist[currentIndex];

  if (!currentPlaylist || currentPlaylist.length === 0 || !currentSong) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0b0618] via-[#120a2a] to-[#1a0f3a] text-white flex flex-col items-center justify-center p-4 text-center">
         <Music size={64} className="text-white/20 mb-6" />
         <h2 className="text-2xl font-bold mb-4">No music detected yet.</h2>
         <button onClick={() => navigate('/detect')} className="bg-pink-500 hover:bg-pink-600 px-6 py-3 rounded-xl font-bold transition">Go to AI Detection</button>
      </div>
    );
  }

  const isSaved = savedVideoIds.includes(currentSong?.videoId);

  const handleNext = async () => {
    if (currentIndex === currentPlaylist.length - 1) {
      await fetchMoreSongs();
    } else {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  const fetchMoreSongs = async () => {
    // 4. PREVENT WEIRD AI BEHAVIOR: Don't fetch new songs if listening to the personal library!
    if (emotion === "Your Library") return;

    try {
      setIsFetchingMore(true);
      const token = localStorage.getItem('token');
      const response = await fetch("https://emotion-music-backend-f06j.onrender.com/api/music/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ emotion }),
      });

      if (response.ok) {
        const data = await response.json();
        setCurrentPlaylist(prev => [...prev, ...data.playlist]);
        setCurrentIndex(currentIndex + 1);
      }
    } catch (error) {
      console.error("Failed to fetch more songs", error);
    } finally {
      setIsFetchingMore(false);
    }
  };

  // ... (Keep the rest of your toggleHistory and return() code exactly the same!)

  // --- UPGRADED: Toggle Save / Remove History ---
  const toggleHistory = async () => {
    const token = localStorage.getItem('token');
    
    try {
      if (isSaved) {
        // Remove from history
        const response = await fetch("https://emotion-music-backend-f06j.onrender.com/api/music/history", {
          method: "DELETE",
          headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
          body: JSON.stringify({ videoId: currentSong.videoId }),
        });

        if (response.ok) {
          setSavedVideoIds(prev => prev.filter(id => id !== currentSong.videoId));
          setSavedStatus('Removed from History');
        }
      } else {
        // Add to history
        const response = await fetch("https://emotion-music-backend-f06j.onrender.com/api/music/history", {
          method: "POST",
          headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
          body: JSON.stringify({ song: currentSong }),
        });

        if (response.ok) {
          setSavedVideoIds(prev => [...prev, currentSong.videoId]);
          setSavedStatus('Saved to History!');
        }
      }
      
      setTimeout(() => setSavedStatus(''), 3000);
    } catch (error) {
      console.error("History toggle failed", error);
    }
  };

  const opts = {
    height: '100%',
    width: '100%',
    playerVars: { autoplay: 1 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b0618] via-[#120a2a] to-[#1a0f3a] text-white p-6 md:p-12">
      <button onClick={() => navigate('/')} className="flex items-center gap-2 text-white/60 hover:text-white mb-8 transition-colors">
        <ArrowLeft size={20} /> Back to Home
      </button>

      <div className="max-w-4xl mx-auto mt-4">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-400 to-purple-500 bg-clip-text text-transparent mb-4">
            Your Perfect Match
          </h1>
          <p className="text-white/60 text-lg md:text-xl">
            Because you are feeling <span className="text-white font-bold px-3 py-1 bg-white/10 rounded-lg mx-1">{emotion}</span>
          </p>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-10 shadow-2xl">
          
          <div className="aspect-video w-full rounded-2xl overflow-hidden shadow-2xl border border-white/10 mb-8 bg-black relative">
            <YouTube 
              videoId={currentSong.videoId} 
              opts={opts} 
              onEnd={handleNext} 
              className="absolute inset-0 w-full h-full"
              iframeClassName="w-full h-full"
            />
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 shrink-0 rounded-full bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center shadow-[0_0_30px_rgba(236,72,153,0.3)] animate-[spin_4s_linear_infinite]">
                <Disc3 size={32} className="text-white" />
              </div>
              <div className="text-center md:text-left">
                <h2 className="text-2xl font-bold text-white mb-1 line-clamp-1">{currentSong.title}</h2>
                <p className="text-pink-300 flex items-center justify-center md:justify-start gap-2"><Music size={16} /> {currentSong.artist}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              
              {/* Dynamic Heart Button */}
              <div className="flex flex-col items-center mr-4 relative">
                <button 
                  onClick={toggleHistory}
                  className={`p-3 border rounded-full transition-colors group
                    ${isSaved 
                      ? 'bg-pink-500/20 border-pink-500 text-pink-500 hover:bg-white/5 hover:border-white/20' 
                      : 'bg-white/5 border-white/10 text-white hover:bg-pink-500/20 hover:text-pink-400 hover:border-pink-500/50'}`}
                  title={isSaved ? "Remove from History" : "Save to History"}
                >
                  <Heart 
                    size={20} 
                    className={`transition-colors ${isSaved ? 'fill-pink-500' : 'group-hover:fill-pink-400'}`} 
                  />
                </button>
                {savedStatus && <span className="text-xs text-pink-400 mt-2 absolute -bottom-6 whitespace-nowrap">{savedStatus}</span>}
              </div>

              {/* Player Controls */}
              <div className="flex items-center gap-2 bg-white/5 p-2 rounded-2xl border border-white/10">
                <button onClick={handlePrev} disabled={currentIndex === 0} className="p-3 rounded-full hover:bg-white/10 disabled:opacity-30">
                  <SkipBack size={20} className="fill-white" />
                </button>
                
                <div className="text-sm font-bold text-white/50 w-16 text-center">
                  {isFetchingMore ? <Loader2 size={16} className="animate-spin mx-auto" /> : `${currentIndex + 1} / ${currentPlaylist.length}`}
                </div>

                <button onClick={handleNext} disabled={isFetchingMore} className="p-3 rounded-full hover:bg-white/10 disabled:opacity-30">
                  <SkipForward size={20} className="fill-white" />
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}