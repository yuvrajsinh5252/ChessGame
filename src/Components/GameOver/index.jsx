import './index.css'
import { useNavigate } from 'react-router-dom';

function GameoOver({ gameOver, socket, room, setBtnClicked }) {
    const navigate = useNavigate();

    if (gameOver[0]) {
        return (
            <div className='gameover'>
                <h1 className='text'>{gameOver[1] == "Draw" ? "Draw?": "GameOver"}</h1>
                <div className='checkmate'>{gameOver[1] == "Draw" ? "" : gameOver[1]}</div>
                <div className='won'>{gameOver[1] != "Draw" ? gameOver[2] : ""}</div>
                {gameOver[1] != "Draw" ? <button className='again'
                    onClick={() => {
                        socket.emit('GameOver', {room: room});
                        navigate('/');
                        setTimeout(() => {
                            window.location.reload();
                        }, 100);  
                    }}
                >Play Again
                </button> : 
                <div className='YesOrNo'>
                    <button className='again'
                        onClick={() => {{
                            socket.emit("draw", { room: room, resign: "Draw", win: "1/2-1/2", draw: "true" });
                            setBtnClicked(true);
                        }}}
                    >Yes
                    </button>
                    <button className='again'
                        onClick={() => {
                            socket.emit("draw", { room: room, resign: "Draw", win: "1/2-1/2", draw: "false"});
                            setBtnClicked(false);
                        }}
                    >No
                    </button>
                </div>
                }
            </div>
        )
    } else {
        return <></>
    }
}

export default GameoOver