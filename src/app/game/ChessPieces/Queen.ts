import { IChessPiece } from "../Interface/IChessPiece"
import { IMove } from "../Interface/IMove"
import { Colors } from "./../Colors";
import { ChessboardItem } from "./../ChessboardItem";
import { Chessboard } from "./../Chessboard";

export class Queen implements IChessPiece {
    id: number
    color: Colors;
    special: boolean;
    position: ChessboardItem;
    readonly sign: string="Queen";
    moves: IMove[]=[];

    constructor(id: number, color: Colors, special:boolean){
        this.id=id;
        this.color=color;
        this.special=special;
    }

    updateMoves(board: Chessboard){
        
    }
}