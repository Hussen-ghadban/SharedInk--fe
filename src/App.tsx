import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import AddSpace from './pages/AddSpace';
import GetSpaces from './pages/Spaces';
import SpaceEditor from './pages/SpaceEditor';
import InvitationsList from './pages/invitation';
import HomePage from './pages/HomePage';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';

export default function AppRouter() {
  return (
    <BrowserRouter>
    <Navbar/>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        
        {/* Protected routes */}
        <Route 
          path="/addSpace" 
          element={
            <ProtectedRoute>
              <AddSpace />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/spaces" 
          element={
            <ProtectedRoute>
              <GetSpaces />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/spaces/:id" 
          element={
            <ProtectedRoute>
              <SpaceEditor />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/invites" 
          element={
            <ProtectedRoute>
              <InvitationsList />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}