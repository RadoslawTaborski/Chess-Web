import { IChessPiece } from "../Interface/IChessPiece"
import { IMove, Type } from "../Interface/IMove"
import { Move } from "../Move"
import { Colors } from "./../Colors";
import { ChessboardItem } from "./../Chessboard/ChessboardItem"
import { Chessboard } from "./../Chessboard/Chessboard";

export abstract class ChessPiece implements IChessPiece {
    id: number
    color: Colors;
    special: boolean;
    position: ChessboardItem;
    abstract readonly sign: string;
    moves: IMove[] = [];
    checking: boolean = false;
    firstmove: boolean = true;

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

    changePosiotion(field: ChessboardItem) {
        this.firstmove = false;
        this.position = field;
    }

    abstract updateMoves(board: Chessboard);

    updateSupport(board: Chessboard, variants: Variant[], range: number) {
        this.cleanMoves();
        let row = this.position.row;
        let col = this.position.col;

        for (let v of variants) {
            for (let i = 1; i < range; ++i) {
                let tmp = board.getField(row + i * v.rowMultiplier, col + i * v.colMultiplier);
                if (tmp != null) {
                    if (tmp.piece == null) {
                        this.moves.push(new Move(this.position, tmp, Type.Ordinary));
                    } else if (tmp.piece.color != this.color) {
                        if (tmp.piece.id != 1) {
                            this.moves.push(new Move(this.position, tmp, Type.Capture));
                            break;
                        } else {
                            this.moves.push(new Move(this.position, tmp, Type.Check));
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

export class Variant {
    rowMultiplier: number;
    colMultiplier: number;

    constructor(rowM: number, colM: number) {
        this.rowMultiplier = rowM;
        this.colMultiplier = colM;
    }
}

export class Pieces {
    static readonly pawn: string = "pionek";
    static readonly rook: string = "Wieża";
    static readonly knight: string = "Skoczek";
    static readonly bishop: string = "Goniec";
    static readonly queen: string = "Hetman";
    static readonly king: string = "Król";
}