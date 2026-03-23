import { Camera, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useRef, useState, useEffect } from "react";

export default function EmotionDetect() {
  const navigate = useNavigate();

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const [cameraOn, setCameraOn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);

  // 🧹 Clean camera on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // 🎥 ENABLE CAMERA
  const enableCamera = async () => {
    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        alert("Camera not supported in this browser.");
        return;
      }

      stopCamera();
      setCameraOn(true);

      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      setCapturedImage(null);

    } catch (error) {
      console.error("Camera error:", error);
      alert("Camera error: " + error.message);
      setCameraOn(false);
    }
  };

  // 🛑 STOP CAMERA
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraOn(false);
  };

  // 📸 CAPTURE & ANALYZE (UPDATED WITH AI & YOUTUBE API)
  const captureAndAnalyze = async () => {
    if (
      !videoRef.current ||
      !videoRef.current.srcObject ||
      videoRef.current.readyState !== 4
    ) {
      alert("Enable camera first.");
      return;
    }

    try {
      setLoading(true);

      const video = videoRef.current;
      const canvas = canvasRef.current;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0);

      const imageData = canvas.toDataURL("image/jpeg");
      setCapturedImage(imageData);

      // Stop camera after capture
      stopCamera();

      // --- NEW: Authentication Check ---
      const token = localStorage.getItem('token');
      if (!token) {
        alert("Please log in to get personalized recommendations.");
        navigate('/login');
        return;
      }

      // --- NEW: Step 1. Get Emotion from AI ---
      const detectResponse = await fetch("https://emotion-music-backend-f06j.onrender.com/api/detect/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: imageData }),
      });

      if (!detectResponse.ok) throw new Error("AI Detection failed");
      const detectData = await detectResponse.json();
      const detectedEmotion = detectData.emotion;

      // --- NEW: Step 2. Get Music based on Emotion, Age, and Language ---
      const musicResponse = await fetch("https://emotion-music-backend-f06j.onrender.com/api/music/recommend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` // Passing the token!
        },
        body: JSON.stringify({ emotion: detectedEmotion }),
      });

      if (!musicResponse.ok) throw new Error("Music fetch failed");
      const musicData = await musicResponse.json();

      // Navigate to Playlist and pass the song data!
      // Navigate to Playlist and pass the full array of songs!
      if (musicData?.playlist) {
        navigate("/playlist", {
          state: {
            emotion: detectedEmotion, // (or just 'emotion' in the manual function)
            playlist: musicData.playlist, // <--- CHANGED THIS LINE
          },
        });
      } else {
        alert("Could not find matching music.");
      }

    } catch (error) {
      console.error("Capture error:", error);
      alert("Error analyzing mood or fetching music.");
    } finally {
      setLoading(false);
    }
  };

  // 🎯 MANUAL EMOTION (UPDATED WITH YOUTUBE API)
  // 🎯 MANUAL EMOTION (UPDATED FOR PLAYLISTS)
  const sendManualEmotion = async (emotion) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert("Please log in to get personalized recommendations.");
        navigate('/login');
        return;
      }

      // 1. Ask backend for music
      const musicResponse = await fetch("https://emotion-music-backend-f06j.onrender.com/api/music/recommend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ emotion }),
      });

      if (!musicResponse.ok) throw new Error("Music fetch failed");
      const musicData = await musicResponse.json();

      // 2. CRITICAL FIX: Check for 'playlist' instead of 'song'
      if (musicData?.playlist) {
        navigate("/playlist", {
          state: {
            emotion: emotion,
            playlist: musicData.playlist, // Pass the playlist array!
          },
        });
      } else {
        alert("Could not find matching music.");
      }

    } catch (error) {
      console.error("Manual emotion error:", error);
      alert("Error fetching music.");
    }
  };
  
  const emotions = [
    { name: "Happy", color: "from-yellow-400 to-orange-500" },
    { name: "Sad", color: "from-blue-400 to-indigo-600" },
    { name: "Neutral", color: "from-green-400 to-teal-500" },
    { name: "Angry", color: "from-pink-500 to-rose-500" },
    { name: "Disgust", color: "from-purple-500 to-fuchsia-500" },
    { name: "Surprise", color: "from-cyan-400 to-blue-500" },
  ];

  // ==========================================================
  // UI REMAINS EXACTLY THE SAME - NO CHANGES TO YOUR CSS/HTML
  // ==========================================================
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b0618] via-[#120a2a] to-[#1a0f3a] text-white">
      <button
        onClick={() => navigate('/')}
        className="p-6 text-white/70 hover:text-white"
      >
        ← Back
      </button>

      <div className="text-center -mt-6">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-400 to-purple-500 bg-clip-text text-transparent">
          Emotion Detection
        </h1>
        <p className="text-white/60 mt-2">
          Position your face or select your mood manually
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-10 px-6 md:px-16 mt-10">
        {/* CAMERA SECTION */}
        <div className="flex flex-col items-center">
          <div className="w-full max-w-xl aspect-video rounded-2xl
                          bg-white/5 border border-white/10
                          backdrop-blur-md shadow-xl
                          flex items-center justify-center relative overflow-hidden">
            {!cameraOn && !capturedImage && (
              <Camera size={60} className="text-white/30" />
            )}

            {cameraOn && (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
            )}

            {capturedImage && (
              <img
                src={capturedImage}
                alt="Captured"
                className="w-full h-full object-cover"
              />
            )}

            <canvas ref={canvasRef} className="hidden" />
            <div className="absolute inset-4 border-2 border-purple-500/60 rounded-xl pointer-events-none"></div>
          </div>

          <p className="mt-4 text-white/60">
            {cameraOn
              ? "Camera Active"
              : capturedImage
              ? "Image Captured"
              : "Camera ready to activate"}
          </p>

          <div className="flex gap-6 mt-6">
            <button
              onClick={enableCamera}
              className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20
                         border border-white/20 flex gap-2 items-center"
            >
              <Camera size={18} />
              Enable Camera
            </button>

            <button
              onClick={captureAndAnalyze}
              disabled={loading}
              className="px-6 py-3 rounded-xl
                         bg-gradient-to-r from-purple-600 to-pink-600
                         hover:scale-105 transition"
            >
              <RefreshCw size={18} className="inline mr-2" />
              {loading ? "Analyzing..." : "Capture & Analyze"}
            </button>
          </div>
        </div>

        {/* MANUAL SECTION */}
        <div>
          <h2 className="text-xl font-semibold mb-6 text-white/80">
            Or choose your mood
          </h2>
          <div className="grid grid-cols-2 gap-5">
            {emotions.map((e) => (
              <div
                key={e.name}
                onClick={() => sendManualEmotion(e.name)}
                className={`p-6 rounded-2xl text-center font-semibold
                            bg-gradient-to-r ${e.color}
                            hover:scale-105 active:scale-95
                            shadow-lg cursor-pointer transition`}
              >
                {e.name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}