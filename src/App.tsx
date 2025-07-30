// src/router.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import AddSpace from './pages/AddSpace';
import GetSpaces from './pages/GetSpaces';
import SpaceEditor from './pages/SpaceEditor';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/addSpace" element={<AddSpace />} />
        <Route path="/spaces" element={<GetSpaces />} />
        <Route path="/spaces/:id" element={<SpaceEditor />} />




        {/* Add more routes here */}
      </Routes>
    </BrowserRouter>
  );
}
