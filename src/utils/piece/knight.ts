import { COLOR, PIECE, Position } from "../models";
import { Piece } from "./piece";

export class Knight extends Piece {
  protected override Piece: PIECE;
  protected override Direction: Position[] = [
    { x: -2, y: -1 },
    { x: -2, y: 1 },
    { x: -1, y: -2 },
    { x: -1, y: 2 },
    { x: 1, y: -2 },
    { x: 1, y: 2 },
    { x: 2, y: -1 },
    { x: 2, y: 1 },
  ];

  constructor(color: COLOR) {
    super(color);
    this.Piece = color === COLOR.White ? PIECE.WhiteKnight : PIECE.BlackKnight;
  }
}
