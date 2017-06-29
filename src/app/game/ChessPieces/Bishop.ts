import { IChessPiece } from "../Interface/IChessPiece"
import { IMove } from "../Interface/IMove"
import { Colors } from "./../Colors";
import { ChessboardItem } from "./../ChessboardItem"

export class Bishop implements IChessPiece {    
    id: number
    color: Colors;
    special: boolean;
    position: ChessboardItem;
    moves: IMove[]=[];

    constructor(id: number, color: Colors, special:boolean){
        this.id=id;
        this.color=color;
        this.special=special;
    }
}