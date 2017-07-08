import { Chessboard } from "./Chessboard/Chessboard";
import { ChessboardItem } from "./Chessboard/ChessboardItem";
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
