import { ChessPiece } from "./ChessPieces/ChessPiece"
import { IMove, Type } from "./Interface/IMove"

export class Move implements IMove {
    source: ChessPiece[];
    target: ChessPiece[];
    type: Type;

    constructor(){
        
    }
}
