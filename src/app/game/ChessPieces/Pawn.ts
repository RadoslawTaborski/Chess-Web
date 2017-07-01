import { IChessPiece } from "../Interface/IChessPiece"
import { IMove, Type } from "../Interface/IMove"
import { Move } from "../Move"
import { Colors } from "./../Colors";
import { ChessboardItem } from "./../ChessboardItem";
import { Chessboard } from "./../Chessboard";

export class Pawn implements IChessPiece {
    id: number
    color: Colors;
    special: boolean;
    position: ChessboardItem;
    readonly sign: string = "pawn";
    moves: IMove[] = [];

    constructor(id: number, color: Colors, special: boolean) {
        this.id = id;
        this.color = color;
        this.special = special;
    }

    updateMoves(board: Chessboard) {
        this.moves = [];
        let row = this.position.row;
        let col = this.position.col;
        if (this.color == Colors.White) {
            let tmp = board.getField(row - 1, col);
            if (tmp!= null && tmp.piece == null) {
                this.moves.push(new Move(this.position, tmp, Type.Ordinary))
            }
            tmp = board.getField(row - 1, col - 1);
            if (tmp!= null && tmp.piece != null && tmp.piece.color == Colors.Black) {
                this.moves.push(new Move(this.position, tmp, Type.Capture))
            }
            tmp = board.getField(row - 1, col + 1);
            if (tmp!= null && tmp.piece != null && tmp.piece.color == Colors.Black) {
                this.moves.push(new Move(this.position, tmp, Type.Capture))
            }
        } else {
            let tmp = board.getField(row + 1, col);
            if (tmp!= null && tmp.piece == null) {
                this.moves.push(new Move(this.position, tmp, Type.Ordinary))
            }
            tmp = board.getField(row + 1, col - 1);
            if (tmp!= null && tmp.piece != null && tmp.piece.color == Colors.White) {
                this.moves.push(new Move(this.position, tmp, Type.Capture))
            }
            tmp = board.getField(row + 1, col + 1);
            if (tmp!= null && tmp.piece != null && tmp.piece.color == Colors.White) {
                this.moves.push(new Move(this.position, tmp, Type.Capture))
            }
        }
    }
}