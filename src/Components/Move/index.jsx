import './index.css'
import x from '../../Utilities/Pieces/index.jsx'

function ShowMoves({ setBoard, setShow,setCheck, setKingTouched, setRookTouched}) {
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
                    setShow(false);
                    setCheck([false,[-1,-1]]);
                    setKingTouched(new Array(10).fill(false));
                    setRookTouched(new Array(10).fill(new Array(10).fill(false)));
                    localStorage.setItem("board", JSON.stringify(pieces)); 
                }}
            >
                Restart
            </button>
        </div>
        </>
    )   
}

export default ShowMoves