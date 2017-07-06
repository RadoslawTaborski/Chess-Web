import { IChessPiece } from "../Interface/IChessPiece"
import { IMove, Type } from "../Interface/IMove"
import { Move } from "../Move"
import { Colors } from "./../Colors";
import { ChessboardItem } from "./../ChessboardItem";
import { Chessboard } from "./../Chessboard";
import { ChessPiece, Variant, Pieces } from "./ChessPiece";

export class Queen extends ChessPiece {
    readonly sign;

    constructor(pieceOrId: IChessPiece | number, color?: Colors, special?: boolean) {
        if (typeof pieceOrId === "object") {
            super(pieceOrId);
        } else if (typeof pieceOrId === "number" && typeof color === "number" && typeof special === "boolean") {
            super(pieceOrId,color,special);
        }
        this.sign=Pieces.queen;
    }

    updateMoves(board: Chessboard) {
        let variants: Variant[]=[];
        variants.push(new Variant(1,1));
        variants.push(new Variant(-1,1));
        variants.push(new Variant(1,-1));
        variants.push(new Variant(-1,-1));
        variants.push(new Variant(1,0));
        variants.push(new Variant(-1,0));
        variants.push(new Variant(0,1));
        variants.push(new Variant(0,-1));
        this.updateSupport(board, variants, 8);
    } 
}