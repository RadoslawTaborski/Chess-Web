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
    checking: boolean = false;

    constructor(id: number, color: Colors, special: boolean);
    constructor(piece: IChessPiece);
    constructor(pieceOrId: IChessPiece | number, color?: Colors, special?: boolean) {
        if (typeof pieceOrId === "object") {
            this.id=pieceOrId.id;
            this.color=pieceOrId.color;
            this.special=pieceOrId.special;
            this.sign=pieceOrId.sign;
            this.checking=pieceOrId.checking;
            this.position=new ChessboardItem(pieceOrId.position);
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
        this.moves = [];
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
        //console.log("len " +this.moves.length);
    }
} //TODO: dodać poruszanie dwóch pól do przodu