import { ChessboardItem } from "./../ChessboardItem"

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