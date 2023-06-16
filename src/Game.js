import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './Pages/Home';

function Game() { 
  return (
      <>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </BrowserRouter>
      </>
    ); 
}

export default Game;   
