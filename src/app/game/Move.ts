import { IChessPiece } from "./Interface/IChessPiece"
import { IMove, Type } from "./Interface/IMove"

export class Move implements IMove {
    source: IChessPiece[];
    target: IChessPiece[];
    type: Type;

    constructor(){

    }
}
