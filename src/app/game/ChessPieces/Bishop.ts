import { IChessPiece } from "../Interface/IChessPiece"
import { IMove, Type } from "../Interface/IMove"
import { Move } from "../Move"
import { Colors } from "./../Colors";
import { ChessboardItem } from "./../ChessboardItem"
import { Chessboard } from "./../Chessboard";

export class Bishop implements IChessPiece {
    id: number
    color: Colors;
    special: boolean;
    position: ChessboardItem;
    readonly sign: string = "Bishop";
    moves: IMove[] = [];
    potentialMoves: IMove[] = [];
    checking: boolean = false;

    constructor(id: number, color: Colors, special: boolean) {
        this.id = id;
        this.color = color;
        this.special = special;
    }

    isChecking(): boolean {
        return this.checking;
    }

    cleanMoves() {
        this.moves = [];
    }

    updateMoves(board: Chessboard) {
        this.checking = false;
        this.cleanMoves();
        let row = this.position.row;
        let col = this.position.col;
        this.potentialMoves = [];
        let variants = [];
        variants.push(new Variant(1, 1));
        variants.push(new Variant(-1, 1));
        variants.push(new Variant(1, -1));
        variants.push(new Variant(-1, -1));

        for (let v of variants) {
            for (let i = 0; i < 8; ++i) {
                let tmp = board.getField(row + i * v.rowMultiplier, col + i * v.colMultiplier);
                if (tmp != null) {
                    if (tmp.piece == null) {
                        this.moves.push(new Move(this.position, tmp, Type.Ordinary));
                        this.potentialMoves.push(new Move(this.position, tmp, Type.Ordinary));
                    } else if (tmp.piece.color != this.color) {
                        if (tmp.piece.id != 1) {
                            this.moves.push(new Move(this.position, tmp, Type.Capture));
                            this.potentialMoves.push(new Move(this.position, tmp, Type.Capture));
                            break;
                        } else {
                            this.checking = true;
                            break;
                        }
                    } else if (tmp.piece.color == this.color) {
                        this.potentialMoves.push(new Move(this.position, tmp, Type.Capture));
                    }
                }
            }
        }
    }

}

class Variant {
    rowMultiplier: number;
    colMultiplier: number;

    constructor(rowM: number, colM: number) {
        this.rowMultiplier = rowM;
        this.colMultiplier = colM;
    }
}