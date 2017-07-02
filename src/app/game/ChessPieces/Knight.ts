import { IChessPiece } from "../Interface/IChessPiece"
import { IMove, Type } from "../Interface/IMove"
import { Move } from "../Move"
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
    potentialMoves: IMove[]=[];
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