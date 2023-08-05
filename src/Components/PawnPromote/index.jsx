import './index.css'
import x from "../../Utilities/Pieces/index.jsx";

const {currElement} = x;

function PawnPromote({ pawnPromote, over, socket, room}) {
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
                <span onClick={(e) => {
                    socket.emit("pawnPromote", { 
                        room: room,
                        target: toPieces[pieceColor].queen,
                        curr: over,
                        turn: pieceColor,
                        currElement: JSON.stringify(Array.from(currElement)),
                    });
                }}>
                    <img src={toPieces[pieceColor].queen} alt="queen" />
                </span>
                <span onClick={(e) => {
                    socket.emit("pawnPromote", { 
                        room: room,
                        target: toPieces[pieceColor].rook,
                        curr: over,
                        turn: pieceColor,
                        currElement: JSON.stringify(Array.from(currElement)),
                    });
                }}>
                    <img src={toPieces[pieceColor].rook} alt="rook" />
                </span>
                <span onClick={(e) => {
                    socket.emit("pawnPromote", { 
                        room: room,
                        target: toPieces[pieceColor].bishop,
                        curr: over,
                        turn: pieceColor,
                        currElement: JSON.stringify(Array.from(currElement)),
                    });
                }}>
                    <img src={toPieces[pieceColor].bishop} alt="bishop" />
                </span>
                <span onClick={(e) => {
                    socket.emit("pawnPromote", { 
                        room: room,
                        target: toPieces[pieceColor].knight,
                        curr: over,
                        turn: pieceColor,
                        currElement: JSON.stringify(Array.from(currElement)),
                    });
                }}>
                    <img src={toPieces[pieceColor].knight} alt="knight" />
                </span>
            </dialog>
        </>
    )
}

export default PawnPromote;