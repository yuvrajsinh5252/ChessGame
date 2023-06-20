import './index.css'
import x from '../../Utilities/Pieces/index.jsx'

function ShowMoves({ setBoard }) {
    const pieces = x.pieces;

    return (
        <>
        <div className='cont'>
            <div className="showMove">
                <div className='player1'></div>
                <div className="moves"></div>
                <div className="player2"></div>
            </div>
            <button
                className="reset"
                onClick={() => {
                    setBoard(pieces);
                    localStorage.setItem("board", JSON.stringify(pieces)); 
                    localStorage.setItem("HistMove", JSON.stringify([-1,-1,-1,-1]));
                    window.location.reload();
                }}
            >
                Restart
            </button>
        </div>
        </>
    )   
}

export default ShowMoves