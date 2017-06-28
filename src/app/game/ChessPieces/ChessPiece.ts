import { Colors } from "./../Colors"
import { ChessboardItem } from "./../ChessboardItem"

export abstract class ChessPiece {
    color: Colors;
    special: boolean;
    moves: ChessboardItem[]=[];
}