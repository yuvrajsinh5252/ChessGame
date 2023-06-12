import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ChessBoard from './Pages/ChessBoard';

function Game() {
  return (
      <>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<ChessBoard />} />
          </Routes>
        </BrowserRouter>
      </>
    );
}

export default Game;