import { IChessPiece } from "../Interface/IChessPiece"
import { IMove, Type } from "../Interface/IMove"
import { Move } from "../Move"
import { Colors } from "./../Colors";
import { ChessboardItem } from "./../Chessboard/ChessboardItem"
import { Chessboard } from "./../Chessboard/Chessboard";
import { ChessPiece, Variant, Pieces } from "./ChessPiece";

export class Knight extends ChessPiece {
    readonly sign;
    variants: Variant[];

    constructor(pieceOrId: IChessPiece | number, color?: Colors, special?: boolean) {
        if (typeof pieceOrId === "object") {
            super(pieceOrId);
        } else if (typeof pieceOrId === "number" && typeof color === "number" && typeof special === "boolean") {
            super(pieceOrId, color, special);
        }
        this.sign = Pieces.knight;
        this.variants = [];
        this.variants.push(new Variant(2, 1));
        this.variants.push(new Variant(1, 2));
        this.variants.push(new Variant(2, -1));
        this.variants.push(new Variant(1, -2));
        this.variants.push(new Variant(-2, -1));
        this.variants.push(new Variant(-1, -2));
        this.variants.push(new Variant(-2, 1));
        this.variants.push(new Variant(-1, 2));
    }

    updateMoves(board: Chessboard) {
        this.cleanMoves();
        let row = this.position.row;
        let col = this.position.col;

        for (let v of this.variants) {
            let tmp = board.getField(row + v.rowMultiplier, col + v.colMultiplier);
            if (tmp != null) {
                if (tmp.piece == null) {
                    this.moves.push(new Move(this.position, tmp, Type.Ordinary));
                } else if (tmp.piece.color != this.color) {
                    if (tmp.piece.id != 1) {
                        this.moves.push(new Move(this.position, tmp, Type.Capture));
                    } else {
                        this.checking = true;
                    }
                }
            }
        }
    }
}