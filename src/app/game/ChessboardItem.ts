import { IChessPiece } from "./Interface/IChessPiece"

export class ChessboardItem {
    row: number;
    col: number;
    piece?: IChessPiece;

    constructor(row: number, col: number){
        this.row=row;
        this.col=col;
    }
}