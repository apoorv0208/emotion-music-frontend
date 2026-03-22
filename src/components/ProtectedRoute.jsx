import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
  // Check if the token exists in localStorage
  const token = localStorage.getItem('token');

  // If there is no token, redirect the user to the login page
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If the token exists, render the page they were trying to go to!
  return children;
}

export default ProtectedRoute;