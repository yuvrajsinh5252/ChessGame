import { COLOR, PIECE, Position } from "../models";
import { Piece } from "./piece";

export class Rook extends Piece {
  private _hasMoved = false;
  protected override Piece: PIECE;
  protected override Direction: Position[] = [
    { x: -1, y: 0 },
    { x: 1, y: 0 },
    { x: 0, y: -1 },
    { x: 0, y: 1 },
  ];

  constructor(color: COLOR) {
    super(color);
    this.Piece = color === COLOR.White ? PIECE.WhiteRook : PIECE.BlackRook;
  }

  public get hasMoved(): boolean {
    return this._hasMoved;
  }

  public set hasMoved(_: boolean) {
    this._hasMoved = true;
  }
}
