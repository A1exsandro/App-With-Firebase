import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { Home } from "./pages/Home";
import { NewRoom } from "./pages/NewRoom";

import { AuthConstextProvider } from './contexts/AuthContext';
import { Room } from './pages/Room';
import { AdminRoom } from './pages/AdiminRoomm';

function App() {
  

  return (
    <BrowserRouter>
    <AuthConstextProvider>
      <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/rooms/new" element={<NewRoom />} />
          <Route path="/rooms/:id" element={<Room />} />
          <Route path="/admin/rooms/:id" element={<AdminRoom />} />
      </Routes>
      </AuthConstextProvider>     
    </BrowserRouter>
  );
}

export default App;
