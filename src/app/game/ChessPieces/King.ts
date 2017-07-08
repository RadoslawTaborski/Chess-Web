import { IChessPiece } from "../Interface/IChessPiece"
import { IMove, Type } from "../Interface/IMove"
import { Colors } from "./../Colors";
import { Rules } from "./../Rules";
import { Move } from "./../Move";
import { Pawn } from "./../ChessPieces/Pawn";
import { ChessboardItem } from "./../Chessboard/ChessboardItem"
import { Chessboard } from "./../Chessboard/Chessboard";
import { ChessPiece, Variant, Pieces } from "./ChessPiece";

export class King extends ChessPiece {
    readonly sign;
    enemies: IChessPiece[];
    variants: Variant[];

    constructor(pieceOrId: IChessPiece | number, color?: Colors, special?: boolean) {
        if (typeof pieceOrId === "object") {
            super(pieceOrId);
        } else if (typeof pieceOrId === "number" && typeof color === "number" && typeof special === "boolean") {
            super(pieceOrId, color, special);
        }
        this.sign = Pieces.king;
        this.enemies = []
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
        this.updateSupport(board, this.variants, 2);
        if (Rules.castling) {
            this.updateSpecialMoves(board);
        }
    }

    private updateSpecialMoves(board: Chessboard) {
        if (this.firstmove) {
            let row = this.position.row;
            let col = this.position.col;
            let variants = [];
            variants.push(new Variant(0, 1));
            variants.push(new Variant(0, -1));
            let range: number[] = [3, 4];
            for (let j = 0; j < variants.length; ++j) {
                for (let i = 1; i <= range[j]; ++i) {
                    let tmp = board.getField(row, col + i * variants[j].colMultiplier);
                    if (tmp != null) {
                        if (tmp.piece == null) {
                            continue;
                        } else if (tmp.piece.sign == Pieces.rook && tmp.piece.firstmove) {
                            this.moves.push(new Move(this.position, board.getField(row, col + 2 * variants[j].colMultiplier), Type.Castle))
                        } else {
                            break;
                        }
                    }
                }
            }
        }
    }
}