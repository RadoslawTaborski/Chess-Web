import { IChessPiece } from "../Interface/IChessPiece"
import { IMove, Type } from "../Interface/IMove"
import { Move } from "../Move"
import { Colors } from "./../Colors";
import { ChessboardItem } from "./../Chessboard/ChessboardItem"
import { Chessboard } from "./../Chessboard/Chessboard";
import { ChessPiece, Variant, Pieces } from "./ChessPiece";
import { Rules } from "../Rules";

export class Pawn extends ChessPiece {
    readonly sign: string;

    type(){
        return "pawn";
    }

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

        let row = this.position.row;
        let col = this.position.col;

        let forward = (this.color == Colors.White ? -1 : 1);
        for (let i = -1; i < 2; ++i) {
            let tmp = board.getField(row + forward, col + i);
            if (i == 0 && tmp != null && tmp.piece == null) {
                this.moves.push(new Move(this.position, tmp, Type.Ordinary))
            } else if (i != 0 && tmp != null && tmp.piece != null && tmp.piece.color != this.color) {
                if (tmp.piece.id != 1) {
                    this.moves.push(new Move(this.position, tmp, Type.Capture))
                } else {
                    this.moves.push(new Move(this.position, tmp, Type.Check));
                    this.checking = true;
                }
            }
        }

        if (Rules.doublePawnSkip){
            this.updateSpecialMoves(board);
        }
    }

    private updateSpecialMoves(board: Chessboard) {
        if (this.firstmove) {
            let row = this.position.row;
            let col = this.position.col;
            let forward = (this.color == Colors.White ? -2 : 2);
            let tmp = board.getField(row + forward / 2, col);
            if (tmp != null && tmp.piece == null) {
                tmp = board.getField(row + forward, col);
                if (tmp != null && tmp.piece == null) {
                    this.moves.push(new Move(this.position, tmp, Type.Ordinary))
                }
            }
        }
    }
} 