import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './Pages/Home';
import LoginPage from './Pages/LoginPage';

function Game() { 
  return (
      <>
        {/* (IsloggedIn ? <LoginPage/> : <></>) */}
        <BrowserRouter>
            <Routes>
              <Route path='/' element={<Home />} />
            </Routes>
        </BrowserRouter>
      </>
    ); 
}

export default Game;   