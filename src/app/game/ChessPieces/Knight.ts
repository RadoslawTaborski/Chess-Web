import { IChessPiece } from "../Interface/IChessPiece"
import { IMove, Type } from "../Interface/IMove"
import { Move } from "../Move"
import { Colors } from "./../Colors";
import { ChessboardItem } from "./../ChessboardItem";
import { Chessboard } from "./../Chessboard";
import { ChessPiece, Variant, Pieces } from "./ChessPiece";

export class Knight extends ChessPiece {
    readonly sign;

    constructor(pieceOrId: IChessPiece | number, color?: Colors, special?: boolean) {
        if (typeof pieceOrId === "object") {
            super(pieceOrId);
        } else if (typeof pieceOrId === "number" && typeof color === "number" && typeof special === "boolean") {
            super(pieceOrId, color, special);
        }
        this.sign = Pieces.knight;
    }

    updateMoves(board: Chessboard) {
        this.cleanMoves();
        let row = this.position.row;
        let col = this.position.col;

        let variants: Variant[] = [];
        variants.push(new Variant(2, 1));
        variants.push(new Variant(1, 2));
        variants.push(new Variant(2, -1));
        variants.push(new Variant(1, -2));
        variants.push(new Variant(-2, -1));
        variants.push(new Variant(-1, -2));
        variants.push(new Variant(-2, 1));
        variants.push(new Variant(-1, 2));

        for (let v of variants) {
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