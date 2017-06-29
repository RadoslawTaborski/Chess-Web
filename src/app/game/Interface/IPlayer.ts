import { IChessPiece } from "./../Interface/IChessPiece"
import { Colors } from "./../Colors"
import { IMove } from "./IMove"

export interface IPlayer {
    name: string;
    color: Colors;
    pieces: IChessPiece[];
    time: number;
    moves: IMove[];

    makeMove();

}