import { IPlayer } from "./Interface/IPlayer"
import { Observer } from "./Pattern/ObserverPattern"
import { IChessPiece } from "./Interface/IChessPiece"
import { Pawn } from "./ChessPieces/Pawn"
import { Rook } from "./ChessPieces/Rook"
import { Bishop } from "./ChessPieces/Bishop"
import { Knight } from "./ChessPieces/Knight"
import { Queen } from "./ChessPieces/Queen"
import { King } from "./ChessPieces/King"
import { Colors } from "./Colors"
import { ChessboardItem } from "./ChessboardItem"
import { Chessboard } from "./Chessboard"
import { IMove, Type } from "./Interface/IMove"

export class Player implements IPlayer {
    observers: Observer[]=[];
    name: string = "";
    color: Colors;
    pieces: IChessPiece[] = [];
    time: number;
    moves: IMove[] = [];

    constructor(name: string, color: Colors, time: number) {
        this.name = name;
        this.color = color;
        this.time = time;

        this.pieces.push(new King(1, color, true));
        this.pieces.push(new Queen(2, color, true));
        this.pieces.push(new Bishop(3, color, true));
        this.pieces.push(new Bishop(4, color, true));
        this.pieces.push(new Knight(5, color, true));
        this.pieces.push(new Knight(6, color, true));
        this.pieces.push(new Rook(7, color, true));
        this.pieces.push(new Rook(8, color, true));
        for (let i = 0; i < 8; ++i) {
            this.pieces.push(new Pawn(9 + i, color, false));
        }
    }

    makeMove() {

    }

    updateMoves(board: Chessboard, checked: boolean) {
        this.moves = [];
        if (!checked) {
            for (let piece of this.pieces) {
                piece.updateMoves(board);
                this.moves.concat(piece.moves);
            }
        } else {
            for (let piece of this.pieces) {
                piece.cleanMoves();
            }
            this.pieces[0].updateMoves(board);
            this.moves.concat(this.pieces[0].moves);
        }
    }

    promotionPawn(board: Chessboard){
        for (let i=0; i<this.pieces.length;++i){
            if (this.pieces[i] instanceof Pawn && (this.pieces[i].position.row==0 || this.pieces[i].position.row==7)) {
                let pos=this.pieces[i].position;
                this.pieces[i]=new Queen(this.pieces[i].id,this.color,true);
                this.pieces[i].position=pos;
                this.event();
                console.log(board);
                console.log(this.pieces[i]);
            }
        }
    }

    isChecking(board: Chessboard): boolean {
        for (let piece of this.pieces) {
            piece.updateMoves(board);
            if (piece.isChecking())
                return true;
        }
        return false;
    }

    addObserver(o: Observer) {
        this.observers.push(o);
    }

    removeObserver(o: Observer) {
        let index=this.observers.indexOf(o);
        if(index>=0)
            this.observers.splice(index,1);
    }

    event() {
        for(let o of this.observers){
            o.update(this);
        }
    }
}