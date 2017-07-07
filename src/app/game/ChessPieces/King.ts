import { IChessPiece } from "../Interface/IChessPiece"
import { IMove, Type } from "../Interface/IMove"
import { Colors } from "./../Colors";
import { Rules } from "./../Rules";
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
        this.enemies = []
    }

    updateMoves(board: Chessboard) {
        let variants: Variant[] = [];
        variants.push(new Variant(1, 1));
        variants.push(new Variant(-1, 1));
        variants.push(new Variant(1, -1));
        variants.push(new Variant(-1, -1));
        variants.push(new Variant(1, 0));
        variants.push(new Variant(-1, 0));
        variants.push(new Variant(0, 1));
        variants.push(new Variant(0, -1));
        this.updateSupport(board, variants, 2);

        if (Rules.castling && this.firstmove) {
            let row = this.position.row;
            let col = this.position.col;
            variants=[];
            variants.push(new Variant(0,1));
            variants.push(new Variant(0,-1));
            let range:number[] = [3,4];
            for (let j=0; j<variants.length;++j) {
                for (let i = 1; i <= range[j]; ++i) {
                    let tmp = board.getField(row, col + i * variants[j].colMultiplier);
                    if (tmp != null) {
                        if (tmp.piece == null) {
                            continue;
                        } else if(tmp.piece.sign==Pieces.rook && tmp.piece.firstmove){
                            this.moves.push(new Move(this.position, board.getField(row,col+2*variants[j].colMultiplier), Type.Castle))
                        } else {
                            break;
                        }
                    }
                }
            }
        }
    }
}