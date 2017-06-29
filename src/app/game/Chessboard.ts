import { ChessboardItem } from "./ChessboardItem"
import { Observer } from "./Pattern/ObserverPattern"
import { IChessPiece } from "./Interface/IChessPiece"

export class Chessboard implements Observer {
    board: ChessboardItem[][]=[];

    constructor(){

    }
    
    update(pieces: IChessPiece[]){

    }
}