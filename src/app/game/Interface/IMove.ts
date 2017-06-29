import { IChessPiece } from "./../Interface/IChessPiece"

export interface IMove {
    source: IChessPiece[];
    target: IChessPiece[];
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