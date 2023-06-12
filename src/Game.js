import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ChessBoard from './Pages/ChessBoard';
import { useState } from 'react';

function Game() {
  const [board, setBoard] = useState([]);
  return (
      <>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<ChessBoard board={board} setBoard={setBoard} />} />
          </Routes>
        </BrowserRouter>
      </>
    );
}

export default Game;