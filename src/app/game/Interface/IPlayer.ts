import { ChessPiece } from "./../ChessPieces/ChessPiece"
import { Colors } from "./../Colors"

export interface IPlayer {
    name: string;
    color: Colors;
    pieces: ChessPiece[];
    time: number;
    move();
}