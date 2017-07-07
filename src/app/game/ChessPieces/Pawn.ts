import { IChessPiece } from "../Interface/IChessPiece"
import { IMove, Type } from "../Interface/IMove"
import { Move } from "../Move"
import { Colors } from "./../Colors";
import { ChessboardItem } from "./../ChessboardItem";
import { Chessboard } from "./../Chessboard";
import { ChessPiece, Variant, Pieces } from "./ChessPiece";
import { Rules } from "../Rules";

export class Pawn extends ChessPiece {
    readonly sign;

    constructor(pieceOrId: IChessPiece | number, color?: Colors, special?: boolean) {
        if (typeof pieceOrId === "object") {
            super(pieceOrId);
        } else if (typeof pieceOrId === "number" && typeof color === "number" && typeof special === "boolean") {
            super(pieceOrId, color, special);
        }
        this.sign = Pieces.pawn;
        this.firstmove = true;
    }

    updateMoves(board: Chessboard) {
        this.checking = false;
        this.cleanMoves();
        this.updateMovesColor(board, this.color);
    }

    private updateMovesColor(board: Chessboard, color: Colors) {
        let row = this.position.row;
        let col = this.position.col;
        let forward = (color == Colors.White ? -1 : 1);
        for (let i = -1; i < 2; ++i) {
            let tmp = board.getField(row + forward, col + i);
            if (i == 0 && tmp != null && tmp.piece == null) {
                this.moves.push(new Move(this.position, tmp, Type.Ordinary))
            } else if (i != 0 && tmp != null && tmp.piece != null && tmp.piece.color != color) {
                if (tmp.piece.id != 1) {
                    this.moves.push(new Move(this.position, tmp, Type.Capture))
                } else {
                    this.checking = true;
                }
            }
        }
        if (Rules.doublePawnSkip) {
            forward = (color == Colors.White ? -2 : 2);
            let tmp = board.getField(row + forward, col);
            if (tmp != null && tmp.piece == null && this.firstmove) {
                this.moves.push(new Move(this.position, tmp, Type.Ordinary))
            }
        }
    }
} 