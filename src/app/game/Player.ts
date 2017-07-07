import { IPlayer } from "./Interface/IPlayer"
import { Observer, Observed } from "./Pattern/ObserverPattern"
import { IChessPiece } from "./Interface/IChessPiece"
import { ChessPiece, Pieces } from "./ChessPieces/ChessPiece"
import { Pawn } from "./ChessPieces/Pawn"
import { Rook } from "./ChessPieces/Rook"
import { Bishop } from "./ChessPieces/Bishop"
import { Knight } from "./ChessPieces/Knight"
import { Queen } from "./ChessPieces/Queen"
import { King } from "./ChessPieces/King"
import { Colors } from "./Colors"
import { ChessboardItem } from "./ChessboardItem"
import { Chessboard } from "./Chessboard"
import { Move } from "./Move"
import { IMove, Type } from "./Interface/IMove"

export class Player implements IPlayer {
    observers: Observer[] = [];
    name: string = "";
    color: Colors;
    pieces: IChessPiece[] = [];
    time: number;
    moves: IMove[] = [];

    constructor(name: string, color: Colors, time: number);
    constructor(player: IPlayer);
    constructor(playerOrName: IPlayer | string, color?: Colors, time?: number) {
        if (typeof playerOrName === "object") {
            this.name = playerOrName.name;
            this.color = playerOrName.color;
            this.time = playerOrName.time;
            for (let item of playerOrName.pieces) {
                switch (item.sign) {
                    case "Rook": { //TODO: nazwy do osobnego pliku
                        this.pieces.push(new Rook(item));
                        break;
                    }
                    case "Bishop": {
                        this.pieces.push(new Bishop(item));
                        break;
                    }
                    case "Knight": {
                        this.pieces.push(new Knight(item));
                        break;
                    }
                    case "Queen": {
                        this.pieces.push(new Queen(item));
                        break;
                    }
                    case "King": {
                        this.pieces.push(new King(item));
                        break;
                    }
                    case "pawn": {
                        this.pieces.push(new Pawn(item));
                        break;
                    }
                }
            }
        } else if (typeof playerOrName === "string" && typeof color === "number" && typeof time === "number") {
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
    }

    updateMoves(board: Chessboard, opponent: IPlayer) {
        this.moves = [];
        for (let piece of this.pieces) {
            piece.updateMoves(board);
            this.moves = this.moves.concat(piece.moves);
        }
        this.leaveCheckBlockingMove(board, opponent);
    }

    private leaveCheckBlockingMove(board: Chessboard, opponent: IPlayer) {
        for (let i = 0; i < this.moves.length; ++i) {
            if (this.simulateMove(board, opponent, this.moves[i])) {
                this.moves.splice(i, 1);
                --i;
            }
        }
    }

    private simulateMove(board: Chessboard, opponent: IPlayer, move: IMove): boolean {
        let boardCopy = new Chessboard();
        let opponentCopy = new Player(opponent);
        let thisCopy = new Player(this);
        boardCopy.setPieces(opponentCopy);
        boardCopy.setPieces(thisCopy);
        let target = boardCopy.board[move.target.row][move.target.col];
        let source = boardCopy.board[move.source.row][move.source.col];
        let newMove=new Move(source,target,move.type);

        if(newMove.type==Type.Capture){
            this.Capture(opponentCopy,newMove.target.piece);
            this.moveWithoutCapture(thisCopy,newMove);
            if(thisCopy.isPromotion(boardCopy)){
                thisCopy.promotionPawn(boardCopy, Pieces.queen); //TODO: niekoniecznie queen
            }
        }
        if(newMove.type==Type.Castle){
            let newMove2:IMove=null;
            if(newMove.target.col==2){
                newMove2=new Move(boardCopy.getField(newMove.target.row,0),boardCopy.getField(newMove.target.row,3),Type.Ordinary);
            }else{
                newMove2=new Move(boardCopy.getField(newMove.target.row,7),boardCopy.getField(newMove.target.row,5),Type.Ordinary);
            }
            this.moveWithoutCapture(thisCopy,newMove);
            this.moveWithoutCapture(thisCopy,newMove2);
        }
        if(newMove.type==Type.Ordinary){
            this.moveWithoutCapture(thisCopy,newMove);
            if(thisCopy.isPromotion(boardCopy)){
                thisCopy.promotionPawn(boardCopy, Pieces.queen); //TODO: niekoniecznie queen
            }
        }       

        let result = opponentCopy.isChecking(boardCopy);

        return result;
    }

    private moveWithoutCapture(player: IPlayer, move: IMove){
        move.target.piece=move.source.piece;
        let index=player.pieces.indexOf(move.target.piece);
        player.pieces[index].changePosiotion(move.target);
        move.source.piece=null;
    }

    private findMove(first:ChessboardItem, second:ChessboardItem): IMove{
        let move=this.moves.filter(item => item.source == first);
        move=move.filter(item => item.target == second);
        return move[0];
    }

    private Capture(player: IPlayer, piece: IChessPiece){
        let index=player.pieces.indexOf(piece);
        player.pieces.splice(index,1);
    }

    isPromotion(board: Chessboard): boolean {
        for (let i = 0; i < this.pieces.length; ++i) {
            if (this.pieces[i] instanceof Pawn && (this.pieces[i].position.row == 0 || this.pieces[i].position.row == 7)) {
                return true;
            }
        }
        return false;
    }

    promotionPawn(board: Chessboard, piece: string) {
        for (let i = 0; i < this.pieces.length; ++i) {
            if (this.pieces[i] instanceof Pawn && (this.pieces[i].position.row == 0 || this.pieces[i].position.row == 7)) {
                let pos = this.pieces[i].position;
                switch (piece) {
                    case Pieces.queen: {
                        this.pieces[i] = new Queen(this.pieces[i].id, this.color, true);
                        break;
                    }
                    case Pieces.rook: {
                        this.pieces[i] = new Rook(this.pieces[i].id, this.color, true);
                        break;
                    }
                    case Pieces.bishop: {
                        this.pieces[i] = new Bishop(this.pieces[i].id, this.color, true);
                        break;
                    }
                    case Pieces.knight: {
                        this.pieces[i] = new Knight(this.pieces[i].id, this.color, true);
                        break;
                    }
                }
                this.pieces[i].position = pos;
                this.event();
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

    update(observed: Observed) {

    }

    addObserver(o: Observer) {
        this.observers.push(o);
    }

    removeObserver(o: Observer) {
        let index = this.observers.indexOf(o);
        if (index >= 0)
            this.observers.splice(index, 1);
    }

    event() {
        for (let o of this.observers) {
            o.update(this);
        }
    }
}