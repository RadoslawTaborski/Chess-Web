import { Colors } from "./../Colors"
import { ChessboardItem } from "./../ChessboardItem"
import { Chessboard } from "./../Chessboard"
import { IMove } from "./IMove"

export interface IChessPiece {
    id: number
    color: Colors;
    special: boolean;
    position: ChessboardItem;
    readonly sign: string;
    moves: IMove[];

    updateMoves(board: Chessboard);
}