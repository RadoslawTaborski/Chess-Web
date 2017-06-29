import { Colors } from "./../Colors"
import { ChessboardItem } from "./../ChessboardItem"
import { IMove } from "./IMove"

export interface IChessPiece {
    id: number
    color: Colors;
    special: boolean;
    position: ChessboardItem;
    moves: IMove[];
}