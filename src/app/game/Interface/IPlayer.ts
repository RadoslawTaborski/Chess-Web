import { IChessPiece } from "./../Interface/IChessPiece"
import { Colors } from "./../Colors"
import { Chessboard } from "./../Chessboard"
import { IMove } from "./IMove"
import { Observed, Observer } from "../Pattern/ObserverPattern"

export interface IPlayer extends Observed {
    name: string;
    color: Colors;
    pieces: IChessPiece[];
    time: number;
    moves: IMove[];

    makeMove();
    updateMoves(board: Chessboard, checked: boolean);
    isChecking(board: Chessboard):boolean;
    promotionPawn(board: Chessboard);
}