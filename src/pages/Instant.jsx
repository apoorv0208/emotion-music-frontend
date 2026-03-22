import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, Sparkles } from 'lucide-react';

export default function Instant() {
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInstantVibe = async () => {
      // 1. Pick a random, upbeat emotion
      const vibes = ["Happy", "Excited", "Chill", "Energetic", "Upbeat"];
      const randomVibe = vibes[Math.floor(Math.random() * vibes.length)];
      const token = localStorage.getItem('token');

      try {
        // 2. Fetch music silently in the background
        const response = await fetch("https://emotion-music-backend-f06j.onrender.com/api/music/recommend", {
          method: "POST",
          headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
          body: JSON.stringify({ emotion: randomVibe })
        });

        const data = await response.json();

        // 3. Immediately transport the user to the player with their new playlist
        if (data.playlist) {
          navigate('/playlist', { 
            state: { 
              emotion: `Instant ${randomVibe} Vibe`, 
              playlist: data.playlist 
            }
          });
        } else {
          navigate('/');
        }
      } catch (error) {
        console.error("Instant play failed", error);
        navigate('/');
      }
    };

    fetchInstantVibe();
  }, [navigate]);

  // The beautiful loading screen they see for 2 seconds while the AI works
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b0618] via-[#120a2a] to-[#1a0f3a] text-white flex flex-col items-center justify-center text-center p-4">
      <Sparkles className="w-16 h-16 text-blue-400 animate-pulse mb-6" />
      <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-4">
        Curating a spontaneous vibe...
      </h1>
      <p className="text-white/60 mb-8">Skipping the camera. Building your playlist.</p>
      <Loader2 className="w-12 h-12 animate-spin text-pink-500" />
    </div>
  );
}