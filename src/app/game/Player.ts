import { IPlayer } from "./Interface/IPlayer"
import { Observed } from "./Pattern/ObserverPattern"
import { ChessPiece } from "./ChessPieces/ChessPiece"
import { Colors } from "./Colors"
import { IMove, Type } from "./Interface/IMove"

export class Player implements IPlayer, Observed {
    name:string="";
    color:Colors;
    pieces: ChessPiece[]=[];    
    time: number;
    moves: IMove[];

    constructor(name: string, color: Colors, time:number){
        this.name=name;
        this.color=color;
        this.time=time;
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