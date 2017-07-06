import { IChessPiece } from "../Interface/IChessPiece"
import { IMove, Type } from "../Interface/IMove"
import { Colors } from "./../Colors";
import { Move } from "./../Move";
import { Pawn } from "./../ChessPieces/Pawn";
import { ChessboardItem } from "./../ChessboardItem";
import { Chessboard } from "./../Chessboard";
import { ChessPiece, Variant, Pieces } from "./ChessPiece";

export class King extends ChessPiece {
    readonly sign;
    enemies: IChessPiece[];

    constructor(pieceOrId: IChessPiece | number, color?: Colors, special?: boolean) {
        if (typeof pieceOrId === "object") {
            super(pieceOrId);
        } else if (typeof pieceOrId === "number" && typeof color === "number" && typeof special === "boolean") {
            super(pieceOrId, color, special);
        }
        this.sign = Pieces.king;
        this.enemies=[]
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
        this.updateSupport(board, variants, 2);
    }
}