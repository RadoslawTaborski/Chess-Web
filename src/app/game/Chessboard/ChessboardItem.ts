import { IChessPiece } from "../Interface/IChessPiece"

export class ChessboardItem {
    row: number;
    col: number;
    piece?: IChessPiece=null;

    constructor(row?: number, col?: number);
    constructor(item?: ChessboardItem);
    constructor(itemOrRow: ChessboardItem|number, col?: number){
        if (typeof itemOrRow === "object") {
            this.row=itemOrRow.row;
            this.col=itemOrRow.col;
            this.piece=itemOrRow.piece;
        } else if (typeof itemOrRow === "number" && typeof col === "number") {
            this.row=itemOrRow;
            this.col=col;
        }
    }
}