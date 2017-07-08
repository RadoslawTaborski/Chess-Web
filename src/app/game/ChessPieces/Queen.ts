import { IChessPiece } from "../Interface/IChessPiece"
import { IMove, Type } from "../Interface/IMove"
import { Move } from "../Move"
import { Colors } from "./../Colors";
import { ChessboardItem } from "./../ChessboardItem";
import { Chessboard } from "./../Chessboard";
import { ChessPiece, Variant, Pieces } from "./ChessPiece";

export class Queen extends ChessPiece {
    readonly sign;
    variants: Variant[];

    constructor(pieceOrId: IChessPiece | number, color?: Colors, special?: boolean) {
        if (typeof pieceOrId === "object") {
            super(pieceOrId);
        } else if (typeof pieceOrId === "number" && typeof color === "number" && typeof special === "boolean") {
            super(pieceOrId, color, special);
        }
        this.sign = Pieces.queen;
        this.variants = [];
        this.variants.push(new Variant(1, 1));
        this.variants.push(new Variant(-1, 1));
        this.variants.push(new Variant(1, -1));
        this.variants.push(new Variant(-1, -1));
        this.variants.push(new Variant(1, 0));
        this.variants.push(new Variant(-1, 0));
        this.variants.push(new Variant(0, 1));
        this.variants.push(new Variant(0, -1));
    }

    updateMoves(board: Chessboard) {
        this.updateSupport(board, this.variants, 8);
    }
}