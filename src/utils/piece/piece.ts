import { COLOR, PIECE, Position } from "../models";

export abstract class Piece {
  protected abstract Piece: PIECE;
  protected abstract Direction: Position[];

  constructor(private color: COLOR) {}

  public get getChar(): PIECE {
    return this.Piece;
  }

  public get getDirection(): Position[] {
    return this.Direction;
  }

  public getColor(): COLOR {
    return this.color;
  }
}
