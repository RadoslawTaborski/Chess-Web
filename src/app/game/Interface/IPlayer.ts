import { IChessPiece } from "./../Interface/IChessPiece"
import { Colors } from "./../Colors"
import { Chessboard } from "./../Chessboard"
import { IMove } from "./IMove"
import { Observed, Observer } from "../Pattern/ObserverPattern"

export interface IPlayer extends Observed, Observer {
    name: string;
    color: Colors;
    pieces: IChessPiece[];
    time: number;
    moves: IMove[];

    updateMoves(board: Chessboard, opponent: IPlayer);
    isChecking(board: Chessboard):boolean;
    isPromotion(board: Chessboard): boolean;
    promotionPawn(board: Chessboard,piece: string);
}