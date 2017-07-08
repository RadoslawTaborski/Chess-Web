import { Colors } from "./../Colors"
import { ChessboardItem } from "./../Chessboard/ChessboardItem"
import { Chessboard } from "./../Chessboard/Chessboard";
import { IMove } from "./IMove"

export interface IChessPiece {
    id: number
    color: Colors;
    special: boolean;
    position: ChessboardItem;
    readonly sign: string;
    moves: IMove[];
    checking: boolean;
    firstmove: boolean;

    updateMoves(board: Chessboard):void;
    isChecking():boolean;
    cleanMoves():void;
    changePosiotion(field: ChessboardItem):void;
}