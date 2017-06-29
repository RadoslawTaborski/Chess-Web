import { ChessPiece } from "./../ChessPieces/ChessPiece"

export interface IMove {
    source: ChessPiece[];
    target: ChessPiece[];
    type: Type;
}

export enum Type {
   Ordinary = 0,
   CaptureBishop,
   CaptureKnight,
   CapturePawn,
   CaptureRock,
   CaptureQueen,
   Check,
   Checkmate,
   Castle
}