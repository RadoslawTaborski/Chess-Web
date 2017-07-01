import { IChessPiece } from "../Interface/IChessPiece"
import { IMove } from "../Interface/IMove"
import { Colors } from "./../Colors";
import { ChessboardItem } from "./../ChessboardItem";
import { Chessboard } from "./../Chessboard";

export class Knight implements IChessPiece {
    id: number
    color: Colors;
    special: boolean;
    position: ChessboardItem;
    readonly sign: string="Knight";
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