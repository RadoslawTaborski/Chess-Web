import { ChessboardItem } from "./ChessboardItem"
import { IMove, Type } from "./Interface/IMove"

export class Move implements IMove {
    source: ChessboardItem;
    target: ChessboardItem;
    type: Type;

    constructor(source: ChessboardItem, target:ChessboardItem, type: Type){
        this.source=source;
        this.target=target;
        this.type=type;
    }
}
