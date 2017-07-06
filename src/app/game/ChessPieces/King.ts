import { IChessPiece } from "../Interface/IChessPiece"
import { IMove, Type } from "../Interface/IMove"
import { Colors } from "./../Colors";
import { Move } from "./../Move";
import { Pawn } from "./../ChessPieces/Pawn";
import { ChessboardItem } from "./../ChessboardItem";
import { Chessboard } from "./../Chessboard";

export class King implements IChessPiece {
    id: number
    color: Colors;
    special: boolean;
    position: ChessboardItem;
    readonly sign: string = "King";
    moves: IMove[] = [];
    potentialMoves: IMove[]=[];
    checking: boolean = false;
    enemies: IChessPiece[] = [];

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
        let row = this.position.row;
        let col = this.position.col;
        this.setEnemies(board);

        for (let i = -1; i < 2; ++i)
            for (let j = -1; j < 2; ++j) {
                if (!(i == 0 && j == 0)) {
                    let tmp = board.getField(row + i, col + j);
                    if (tmp != null && tmp.piece == null) {
                        if (this.clearField(tmp))
                            this.moves.push(new Move(this.position, tmp, Type.Ordinary));
                    } else if (tmp != null && tmp.piece!=null && tmp.piece.color != this.color) {
                        if (this.clearField(tmp))
                            this.moves.push(new Move(this.position, tmp, Type.Capture));
                    }
                }
            }
    }

    private setEnemies(board: Chessboard) {
        this.enemies=[];
        for (let i = 0; i < 8; ++i)
            for (let j = 0; j < 8; ++j) {
                let tmp = board.board[i][j];
                if (tmp.piece != null && tmp.piece.color != this.color) {
                    this.enemies.push(tmp.piece);
                }
            }
    }

    private clearField(field: ChessboardItem): boolean {
        for (let enemy of this.enemies)
                for (let item of enemy.moves)
                    if (item.target == field){
                        console.log("pawn");
                        return false;
                    }
        return true;
    }
}