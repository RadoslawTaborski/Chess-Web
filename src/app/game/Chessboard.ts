import { ChessboardItem } from "./ChessboardItem"
import { Observer } from "./Pattern/ObserverPattern"
import { ChessPiece } from "./ChessPieces/ChessPiece"

export class Chessboard implements Observer {
    board: ChessboardItem[][]=[];

    update(pieces: ChessPiece[]){

    }
}