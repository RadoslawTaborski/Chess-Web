import { IPlayer } from "./Interface/IPlayer"
import { Observed } from "./Pattern/ObserverPattern"
import { IChessPiece } from "./Interface/IChessPiece"
import { Pawn } from "./ChessPieces/Pawn"
import { Rook } from "./ChessPieces/Rook"
import { Bishop } from "./ChessPieces/Bishop"
import { Knight } from "./ChessPieces/Knight"
import { Queen } from "./ChessPieces/Queen"
import { King } from "./ChessPieces/King"
import { Colors } from "./Colors"
import { ChessboardItem } from "./ChessboardItem"
import { IMove, Type } from "./Interface/IMove"

export class Player implements IPlayer, Observed {
    name:string="";
    color:Colors;
    pieces: IChessPiece[]=[];    
    time: number;
    moves: IMove[];

    constructor(name: string, color: Colors, time:number){
        this.name=name;
        this.color=color;
        this.time=time;

        this.pieces.push(new King(1, color, true));
        this.pieces.push(new Queen(2, color, true));
        this.pieces.push(new Bishop(3, color, true));
        this.pieces.push(new Bishop(4, color, true));
        this.pieces.push(new Knight(5, color, true));
        this.pieces.push(new Knight(6, color, true));
        this.pieces.push(new Rook(7, color, true));
        this.pieces.push(new Rook(8, color, true));
    }

    makeMove(){

    }

    addObserver(o: Observed){

    }

    removeObserver(o: Observed){

    }

    event(){

    }
}