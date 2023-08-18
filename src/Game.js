import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './Pages/Home';
import LoginPage from './Pages/LoginPage';
import { io } from 'socket.io-client';

function Game() { 
  const socket = io('https://chessgame-backend.onrender.com/');
  
  return (
      <>
        <BrowserRouter>
            <Routes>
              <Route path='/' element={<LoginPage socket={socket} />} />
              <Route path='/ChessGame' element={<Home socket={socket} />} />
            </Routes>
        </BrowserRouter>
      </>
    ); 
}

export default Game;   