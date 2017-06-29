import { ChessPiece } from "./../ChessPieces/ChessPiece"
import { Colors } from "./../Colors"
import { IMove } from "./IMove"

export interface IPlayer {
    name: string;
    color: Colors;
    pieces: ChessPiece[];
    time: number;
    moves: IMove[];

    makeMove();

}