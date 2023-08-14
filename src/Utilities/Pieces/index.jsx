let pieces = []; // 2d array to store the pieces
let currElement = new Map();

let NmaeToImg = new Map();

for (let i = 0; i < 8; i++) {
    let temp = [];
    for (let j = 0; j < 8; j++) {
        if (i === 0) {
            if (j === 0 || j === 7)
                {temp.push("/images/rook_b.png"); currElement.set("/images/rook_b.png", "rook_b");}
            if (j === 1 || j === 6) 
                {temp.push("/images/knight_b.png"); currElement.set("/images/knight_b.png", "knight_b");}  
            if (j === 2 || j === 5)
                {temp.push("/images/bishop_b.png"); currElement.set("/images/bishop_b.png", "bishop_b");}
            if (j === 4) 
                {temp.push("/images/king_b.png"); currElement.set("/images/king_b.png", "king_b");}
            if (j === 3) 
                {temp.push("/images/queen_b.png"); currElement.set("/images/queen_b.png", "queen_b");}
        } else if (i === 7) {
            if (j === 0 || j === 7)
                {temp.push("/images/rook_w.png"); currElement.set("/images/rook_w.png", "rook_w");}
            if (j === 1 || j === 6) 
                {temp.push("/images/knight_w.png"); currElement.set("/images/knight_w.png", "knight_w");}
            if (j === 2 || j === 5) 
                {temp.push("/images/bishop_w.png"); currElement.set("/images/bishop_w.png", "bishop_w");}
            if (j === 4) 
                {temp.push("/images/king_w.png"); currElement.set("/images/king_w.png", "king_w");}
            if (j === 3) 
                {temp.push("/images/queen_w.png"); currElement.set("/images/queen_w.png", "queen_w");}
        } 
        else if (i === 1) 
            {temp.push("/images/pawn_b.png"); currElement.set("/images/pawn_b.png", "pawn_b");}
        else if (i === 6) 
            {temp.push("/images/pawn_w.png"); currElement.set("/images/pawn_w.png", "pawn_w");} 
        else {temp.push(null); currElement.set(null, "null");}
    }
    pieces.push(temp);
}

for (let [key , value] of currElement) {
    NmaeToImg.set(value, key);
}

export default {pieces, currElement, NmaeToImg};