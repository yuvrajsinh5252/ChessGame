import React from 'react';
import { useState } from 'react';
import './index.css';
import Chessboard from '../ChessBoard';
import ShowMoves from '../../Components/Move';

function Home() {
    const [board, setBoard] = useState([]);

    return (
        <div className='home'>
            <ShowMoves />
            <div className='board'>
                <Chessboard board={board} setBoard={setBoard} />
            </div>
        </div>
    )
}

export default Home