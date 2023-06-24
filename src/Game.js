import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './Pages/Home';
import LoginPage from './Pages/LoginPage';

function Game() { 
  return (
      <>
        {/* <LoginPage /> */}
        <BrowserRouter>
            <Routes>
              <Route path='/' element={<Home />} />
              {/* <Route path='/LoginPage'element={<LoginPage />} /> */}
            </Routes>
        </BrowserRouter>
      </>
    ); 
}

export default Game;   
