import pieces from "../../Pieces";
import "./index.css";

// dragging process
const draged_piece = document.querySelectorAll('.drag');
const squares = document.querySelectorAll('.white,.black');

draged_piece.forEach(piece => {
    piece.addEventListener('dragstart', () => piece.classList.add('hold'))
    piece.addEventListener('dragend', () => piece.classList.remove('hold'))
});
squares.forEach(square => {
    square.addEventListener('dragover', e => {
        e.preventDefault();
        const draggable = document.querySelector('.hold');
        if (!square.hasChildNodes()) square.appendChild(draggable);
    })
});
// dragging ends

function ChessBoard() {
    const n = 8; // size of the chess board
    let board = []; // 2d array to store the chess board

    for (let i = 0; i < n; i++) {
        let temp = [];

        for (let j = 0; j < n; j++) {
            if ((i + j) % 2 === 0) temp.push(<div key={j} className="black">{pieces[i][j]?<img className="drag" src={pieces[i][j]} alt="asdasdas" />:<></> }</div>);
            else temp.push(<div key={j} className="white">{pieces[i][j]?<img className="drag" src={pieces[i][j]} alt="asdasds" /> : <></>}</div>);
        }
        board.push(<div key={i} className="rows">{temp}</div>);
    }

    return (
        <>
            <div className="chessboard">
                <div className="border">
                    {board}
                </div>
            </div>
        </>
    )
}

export default ChessBoard;