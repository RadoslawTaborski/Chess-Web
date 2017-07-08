import { ChessboardItem } from "./../Chessboard/ChessboardItem"
import { Chessboard } from "./../Chessboard/Chessboard";

export interface IMove {
    source: ChessboardItem;
    target: ChessboardItem;
    type: Type;
}

export enum Type {
   Ordinary = 0,
   Capture,
   Check,
   Checkmate,
   Castle
}