import rook_b from "..\\public\\images\\rook_b.png";
import rook_w from "..\\public\\images\\rook_w.png";
import knight_w from "..\\public\\images\\knight_w.png";
import knight_b from "..\\public\\images\\knight_b.png";
import bishop_w from "..\\public\\images\\bishop_w.png";
import bishop_b from "..\\public\\images\\bishop_b.png";
import knig_w from "..\\public\\images\\king_w.png";
import king_b from "..\\public\\images\\king_b.png";
import queen_b from "..\\public\\images\\queen_b.png";
import queen_w from "..\\public\\images\\queen_w.png";
import pawn_b from "..\\public\\images\\pawn_b.png";
import pawn_w from "..\\public\\images\\pawn_w.png";

let pieces = []; // 2d array to store the pieces

for (let i = 0; i < 8; i++) {
    let temp = [];
    for (let j = 0; j < 8; j++) {
        if (i === 0) {
            if (j === 0 || j === 7) temp.push(rook_b)
            if (j === 1 || j === 6) temp.push(knight_b)  
            if (j === 2 || j === 5) temp.push(bishop_b)
            if (j === 4) temp.push(king_b)
            if (j === 3) temp.push(queen_b)
        } else if (i === 7) {
            if (j === 0 || j === 7) temp.push(rook_w)
            if (j === 1 || j === 6) temp.push(knight_w)
            if (j === 2 || j === 5) temp.push(bishop_w)
            if (j === 4) temp.push(knig_w)
            if (j === 3) temp.push(queen_w)
        } 
        else if (i === 1) temp.push(pawn_b)
        else if (i === 6) temp.push(pawn_w) 
        else temp.push(null);
    }
    pieces.push(temp);
}
export default pieces;