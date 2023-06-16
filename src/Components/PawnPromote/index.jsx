import './index.css'
import x from "../../Utilities/Pieces/index.jsx";

function PromoteThis(setPawnPromote, target,curr ,board, setBoard) {
    board = JSON.parse(JSON.stringify(board));
    let i = curr[0];
    let j = curr[1];
    board[i][j] = target;
    setBoard(board);
    setPawnPromote([false, "white"])
}

function PawnPromote({openIt,setPawnPromote, board, setBoard, index}) {
    const { NmaeToImg } = x;
    let toPieces = {
        "white": {
            "queen": NmaeToImg.get("queen_w"),
            "rook": NmaeToImg.get("rook_w"),
            "bishop": NmaeToImg.get("bishop_w"),
            "knight": NmaeToImg.get("knight_w")
        },
        "black": {
            "queen": NmaeToImg.get("queen_b"),
            "rook": NmaeToImg.get("rook_b"),
            "bishop": NmaeToImg.get("bishop_b"),
            "knight": NmaeToImg.get("knight_b")
        }
    };

    let side = true
    let pieceColor = openIt[1];
    side = (pieceColor == "white" ? true : false);

    return (
        <>
            <dialog 
                open={openIt[0]}
                style={{ top: (side ? "4%" : "76.5%") }} 
                className={side ? "up" : "down"}
            >
                <span onClick={(e) => {PromoteThis(setPawnPromote, toPieces[pieceColor].queen , index, board, setBoard)}}>
                    <img src={toPieces[pieceColor].queen} alt="queen" />
                </span>
                <span onClick={(e) => {PromoteThis(setPawnPromote, toPieces[pieceColor].rook , index, board, setBoard)}}>
                    <img src={toPieces[pieceColor].rook} alt="rook" />
                </span>
                <span onClick={(e) => {PromoteThis(setPawnPromote, toPieces[pieceColor].bishop , index, board, setBoard)}}>
                    <img src={toPieces[pieceColor].bishop} alt="bishop" />
                </span>
                <span onClick={(e) => {PromoteThis(setPawnPromote, toPieces[pieceColor].knight , index, board, setBoard)}}>
                    <img src={toPieces[pieceColor].knight} alt="knight" />
                </span>
            </dialog>
        </>
    )
}

export default PawnPromote;