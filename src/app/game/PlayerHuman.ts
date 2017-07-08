import { IPlayer } from "./Interface/IPlayer"
import { Observer, Observed } from "./Pattern/ObserverPattern"
import { IChessPiece } from "./Interface/IChessPiece"
import { ChessPiece, Pieces } from "./ChessPieces/ChessPiece"
import { Pawn } from "./ChessPieces/Pawn"
import { Rook } from "./ChessPieces/Rook"
import { Bishop } from "./ChessPieces/Bishop"
import { Knight } from "./ChessPieces/Knight"
import { Queen } from "./ChessPieces/Queen"
import { King } from "./ChessPieces/King"
import { Colors } from "./Colors"
import { Player } from "./Player"
import { ChessboardItem } from "./ChessboardItem"
import { Chessboard } from "./Chessboard"
import { Move } from "./Move"
import { IMove, Type } from "./Interface/IMove"

export class PlayerHuman extends Player {

    constructor(playerOrName: IPlayer | string, color?: Colors, time?: number){
        if (typeof playerOrName === "object") {
            super(playerOrName);
        } else if (typeof playerOrName === "string" && typeof color === "number" && typeof time === "number") {
            super(playerOrName, color, time);
        }  
    }

}