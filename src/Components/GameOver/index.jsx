import './index.css'
import { useNavigate } from 'react-router-dom';

function GameoOver({ gameOver, socket, room }) {
    const navigate = useNavigate();

    if (gameOver[0]) {
        return (
            <div className='gameover'>
                <h1 className='text'>GameOver</h1>
                <div className='checkmate'>{gameOver[1]}</div>
                <div className='won'>{gameOver[2]}</div>
                <button className='again'
                    onClick={() => {
                        socket.emit('GameOver', {room: room});
                        navigate('/');
                        setTimeout(() => {
                            window.location.reload();
                        }, 100);  
                    }}
                >Play Again
                </button>
            </div>
        )
    } else {
        return <></>
    }
}

export default GameoOver