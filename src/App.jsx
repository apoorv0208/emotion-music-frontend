import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import EmotionDetect from './pages/EmotionDetect';
import History from './pages/History';
import Instant from './pages/Instant';
import ProtectedRoute from './components/ProtectedRoute'; // <-- Import your new guard
import Playlist from './pages/playlist';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 text-white font-sans">
      <Routes>
        {/* Public Routes - Anyone can access these */}
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Protected Routes - Only logged-in users can access these */}
        <Route 
          path="/detect" 
          element={
            <ProtectedRoute>
              <EmotionDetect />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/playlist" 
          element={ 
            <ProtectedRoute> 
              <Playlist /> 
            </ProtectedRoute> } 
        />
        <Route 
          path="/history" 
          element={
            <ProtectedRoute>
              <History />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/instant" 
          element={
            <ProtectedRoute>
              <Instant />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </div>
  );
}

export default App;