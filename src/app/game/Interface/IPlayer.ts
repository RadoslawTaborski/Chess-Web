import { IChessPiece } from "./../Interface/IChessPiece"
import { Colors } from "./../Colors"
import { Chessboard } from "./../Chessboard"
import { IMove } from "./IMove"

export interface IPlayer {
    name: string;
    color: Colors;
    pieces: IChessPiece[];
    time: number;
    moves: IMove[];

    makeMove();
    updateMoves(board: Chessboard, checked: boolean);
    isChecking(board: Chessboard):boolean;
}