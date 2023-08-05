import './index.css'
import x from '../../Utilities/Pieces';

function GameoOver({ gameOver }) {
    const {pieces} = x;

    if (gameOver[0]) {
        return (
            <div className='gameover'>
                <h1 className='text'>GameOver</h1>
                <div className='checkmate'>{gameOver[1]}</div>
                <div className='won'>{gameOver[2] == 'w' ? 'White Wins' : 'Black Wins'}</div>
                <button className='again'
                    onClick={() => {
                        window.location.reload();
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