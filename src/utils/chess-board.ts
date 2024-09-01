import { COLOR, PIECE } from "./models";
import { Bishop } from "./piece/bishop";
import { King } from "./piece/king";
import { Knight } from "./piece/knight";
import { Pawn } from "./piece/pawn";
import { Piece } from "./piece/piece";
import { Queen } from "./piece/queen";
import { Rook } from "./piece/rook";

export class ChessBoard {
  private chessBoard: (Piece | null)[][];
  private _playerTurn = COLOR.White;

  constructor() {
    this.chessBoard = [
      [
        new Rook(COLOR.White),
        new Knight(COLOR.White),
        new Bishop(COLOR.White),
        new Queen(COLOR.White),
        new King(COLOR.White),
        new Bishop(COLOR.White),
        new Knight(COLOR.White),
        new Rook(COLOR.White),
      ],
      [Array(8).fill(new Pawn(COLOR.White))],
      Array(8).fill(null),
      Array(8).fill(null),
      Array(8).fill(null),
      Array(8).fill(null),
      [Array(8).fill(new Pawn(COLOR.Black))],
      [
        new Rook(COLOR.Black),
        new Knight(COLOR.Black),
        new Bishop(COLOR.Black),
        new Queen(COLOR.Black),
        new King(COLOR.Black),
        new Bishop(COLOR.Black),
        new Knight(COLOR.Black),
        new Rook(COLOR.Black),
      ],
    ];
  }

  public get playerTurn(): COLOR {
    return this._playerTurn;
  }

  public get ChessBoard(): (PIECE | null)[][] {
    return this.chessBoard.map((row) =>
      row.map((pieces) => (pieces instanceof Piece ? pieces.getChar : null))
    );
  }

  public static isDarkSquare({
    row,
    col,
  }: {
    row: number;
    col: number;
  }): boolean {
    return (row + col) % 2 === 1;
  }
}
