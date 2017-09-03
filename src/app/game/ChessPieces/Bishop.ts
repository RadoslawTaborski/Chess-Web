import { IChessPiece } from "../Interface/IChessPiece"
import { IMove, Type } from "../Interface/IMove"
import { Move } from "../Move"
import { Colors } from "./../Colors";
import { ChessboardItem } from "./../Chessboard/ChessboardItem"
import { Chessboard } from "./../Chessboard/Chessboard";
import { ChessPiece, Variant, Pieces } from "./ChessPiece";

export class Bishop extends ChessPiece {
    readonly sign;
    variants: Variant[];

    type(){
        return "bishop";
    }

    constructor(pieceOrId: IChessPiece | number, color?: Colors, special?: boolean) {
        if (typeof pieceOrId === "object") {
            super(pieceOrId);
        } else if (typeof pieceOrId === "number" && typeof color === "number" && typeof special === "boolean") {
            super(pieceOrId,color,special);
        }
        this.sign=Pieces.bishop;
        this.variants=[];
        this.variants.push(new Variant(1,1));
        this.variants.push(new Variant(-1,1));
        this.variants.push(new Variant(1,-1));
        this.variants.push(new Variant(-1,-1));
    }

    updateMoves(board: Chessboard) {
        this.updateSupport(board, this.variants, 8);
    } 
}

