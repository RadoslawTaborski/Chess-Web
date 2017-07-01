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
    checking: boolean=false;

    constructor(id: number, color: Colors, special: boolean) {
        this.id = id;
        this.color = color;
        this.special = special;
    }

    isChecking():boolean{
        return this.checking;
    }

    cleanMoves(){
        this.moves=[];
    }

    updateMoves(board: Chessboard) {
        this.checking=false;
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
                if (tmp.piece.id!=1){
                    this.moves.push(new Move(this.position, tmp, Type.Capture))
                }else{
                    this.checking=true;
                }
            }
            tmp = board.getField(row - 1, col + 1);
            if (tmp!= null && tmp.piece != null && tmp.piece.color == Colors.Black) {
                if (tmp.piece.id!=1){
                    this.moves.push(new Move(this.position, tmp, Type.Capture))
                }else{
                    this.checking=true;
                }
            }
        } else {
            let tmp = board.getField(row + 1, col);
            if (tmp!= null && tmp.piece == null) {
                this.moves.push(new Move(this.position, tmp, Type.Ordinary))
            }
            tmp = board.getField(row + 1, col - 1);
            if (tmp!= null && tmp.piece != null && tmp.piece.color == Colors.White) {
                if (tmp.piece.id!=1){
                    this.moves.push(new Move(this.position, tmp, Type.Capture))
                }else{
                    this.checking=true;
                }
            }
            tmp = board.getField(row + 1, col + 1);
            if (tmp!= null && tmp.piece != null && tmp.piece.color == Colors.White) {
                if (tmp.piece.id!=1){
                    this.moves.push(new Move(this.position, tmp, Type.Capture))
                }else{
                    this.checking=true;
                }
            }
        }
    }
}