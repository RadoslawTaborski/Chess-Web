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
    checking: boolean = false;

    constructor(id: number, color: Colors, special: boolean);
    constructor(piece: IChessPiece);
    constructor(pieceOrId: IChessPiece | number, color?: Colors, special?: boolean) {
        if (typeof pieceOrId === "object") {
            this.id = pieceOrId.id;
            this.color = pieceOrId.color;
            this.special = pieceOrId.special;
            this.sign = pieceOrId.sign;
            this.checking = pieceOrId.checking;
            this.position = new ChessboardItem(pieceOrId.position);
        } else if (typeof pieceOrId === "number" && typeof color === "number" && typeof special === "boolean") {
            this.id = pieceOrId;
            this.color = color;
            this.special = special;
        }
    }

    isChecking(): boolean {
        return this.checking;
    }

    cleanMoves() {
        this.checking = false;
        this.moves = [];
    }

    updateMoves(board: Chessboard) {
        this.cleanMoves();
        let row = this.position.row;
        let col = this.position.col;
        let variants = [];
        variants.push(new Variant(1, 1));
        variants.push(new Variant(-1, 1));
        variants.push(new Variant(1, -1));
        variants.push(new Variant(-1, -1));

        for (let v of variants) {
            for (let i = 1; i < 8; ++i) {
                let tmp = board.getField(row + i * v.rowMultiplier, col + i * v.colMultiplier);
                if (tmp != null) {
                    if (tmp.piece == null) {
                        this.moves.push(new Move(this.position, tmp, Type.Ordinary));
                    } else if (tmp.piece.color != this.color) {
                        if (tmp.piece.id != 1) {
                            this.moves.push(new Move(this.position, tmp, Type.Capture));
                            break;
                        } else {
                            this.checking = true;
                            break;
                        }
                    } else if (tmp.piece.color == this.color) {
                        break;
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