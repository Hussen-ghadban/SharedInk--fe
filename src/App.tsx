// src/router.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import AddSpace from './pages/AddSpace';
import GetSpaces from './pages/Spaces';
import SpaceEditor from './pages/SpaceEditor';
import InvitationsList from './pages/invitation';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/addSpace" element={<AddSpace />} />
        <Route path="/spaces" element={<GetSpaces />} />
        <Route path="/spaces/:id" element={<SpaceEditor />} />
        <Route path="/invites" element={<InvitationsList />} />

      </Routes>
    </BrowserRouter>
  );
}
