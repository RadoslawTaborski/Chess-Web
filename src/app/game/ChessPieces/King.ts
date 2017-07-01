import { IChessPiece } from "../Interface/IChessPiece"
import { IMove } from "../Interface/IMove"
import { Colors } from "./../Colors";
import { ChessboardItem } from "./../ChessboardItem";
import { Chessboard } from "./../Chessboard";

export class King implements IChessPiece {
    id: number
    color: Colors;
    special: boolean;
    position: ChessboardItem;
    readonly sign: string="King";
    moves: IMove[]=[];
    checking: boolean=false;

    constructor(id: number, color: Colors, special:boolean){
        this.id=id;
        this.color=color;
        this.special=special;
    }

    isChecking():boolean{
        return this.checking;
    }

    cleanMoves(){
        this.moves=[];
    }

    updateMoves(board: Chessboard){
        
    }
}