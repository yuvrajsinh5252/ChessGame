import './index.css'
import x from "../../Utilities/Pieces/index.jsx";
import { IsCheck } from '../../Utilities/CheckMate';

const {currElement} = x;

function PromoteThis(setPawnPromote, target,curr ,board, setBoard, setCheck, pieceColor) {
    board = JSON.parse(JSON.stringify(board));
    let i = curr[0];
    let j = curr[1];
    board[i][j] = target;
    setBoard(board);
    setPawnPromote([false, "white"])

    let turn = (pieceColor === "white" ? "w" : "b");

    let kingPos = IsCheck(board, currElement, turn);
    let kingPos2 = IsCheck(board, currElement, turn == "w" ? "b" : "w");
    let king = (kingPos[0] != -1 ? kingPos : kingPos2);

    if (king[0] != -1) {
        setCheck([true, king]);
    }
    else setCheck([false, [-1, -1]]);
}

function PawnPromote({ pawnPromote,setPawnPromote, board, setBoard, over, setCheck}) {
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
    let pieceColor = pawnPromote[1];
    side = (pieceColor == "white" ? true : false);

    return (
        <>
            <dialog 
                open={pawnPromote[0]}
                style={{ top: (side ? "4%" : "76.5%") }} 
                className={side ? "up" : "down"}
            >
                <span onClick={(e) => {PromoteThis(setPawnPromote, toPieces[pieceColor].queen , over, board, setBoard, setCheck, pieceColor)}}>
                    <img src={toPieces[pieceColor].queen} alt="queen" />
                </span>
                <span onClick={(e) => {PromoteThis(setPawnPromote, toPieces[pieceColor].rook , over, board, setBoard, setCheck, pieceColor)}}>
                    <img src={toPieces[pieceColor].rook} alt="rook" />
                </span>
                <span onClick={(e) => {PromoteThis(setPawnPromote, toPieces[pieceColor].bishop , over, board,setBoard, setCheck, pieceColor)}}>
                    <img src={toPieces[pieceColor].bishop} alt="bishop" />
                </span>
                <span onClick={(e) => {PromoteThis(setPawnPromote, toPieces[pieceColor].knight , over, board, setBoard, setCheck, pieceColor)}}>
                    <img src={toPieces[pieceColor].knight} alt="knight" />
                </span>
            </dialog>
        </>
    )
}

export default PawnPromote;