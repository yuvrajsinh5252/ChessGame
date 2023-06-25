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
                        localStorage.setItem("board", JSON.stringify(pieces)); 
                        localStorage.setItem("HistMove", JSON.stringify([-1,-1,-1,-1]));
                        localStorage.setItem("Notation", JSON.stringify({Moves: []}));
                        localStorage.setItem("EpMove", JSON.stringify(new Array(4).fill(-1)));
                        localStorage.setItem("kingTouched", JSON.stringify(new Array(8).fill(false)));
                        localStorage.setItem("rookTouched", JSON.stringify(new Array(8).fill(new Array(8).fill(false))));
                        localStorage.setItem("PieceKilled", JSON.stringify([]));
                        localStorage.setItem("turn", JSON.stringify("w"));
                        localStorage.setItem("check", JSON.stringify([false,[-1,-1]]));
                        localStorage.setItem("gameOver", JSON.stringify([false, "", ""]));
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