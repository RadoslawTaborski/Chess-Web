import { IPlayer } from "./Interface/IPlayer"
import { Observer, Observed } from "./Pattern/ObserverPattern"
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

    makeMove() {

    }

    updateMoves(board: Chessboard, opponent: IPlayer) {
        this.moves = [];
        for (let piece of this.pieces) {
            piece.updateMoves(board);
            this.moves = this.moves.concat(piece.moves);
        }
        this.leaveCheckBlockingMove(board, opponent);
        this.removeMovesCausesCheck(board, opponent);
    }

    private leaveCheckBlockingMove(board: Chessboard, opponent: IPlayer) {
        for (let i = 0; i < this.moves.length; ++i) {
            if (this.simulateMove(board, opponent, this.moves[i])) {
                this.moves.splice(i, 1);
                --i;
                console.log(this.moves);
            }
        }
    }

    private removeMovesCausesCheck(board: Chessboard, opponent: IPlayer){
        for (let i = 0; i < this.moves.length; ++i) {
            if (this.simulateMove(board, opponent, this.moves[i])) {
                this.moves.splice(i, 1);
                --i;
                console.log(this.moves);
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
        if (target.piece != null) {
            let index = opponentCopy.pieces.indexOf(target.piece);
            opponentCopy.pieces.splice(index, 1);
        }
        target.piece = source.piece;
        let index = thisCopy.pieces.indexOf(target.piece);
        thisCopy.pieces[index].position = target;
        source.piece = null;
        thisCopy.promotionPawn(boardCopy);

        let result = opponentCopy.isChecking(boardCopy);

        return result;
    }

    promotionPawn(board: Chessboard) {
        for (let i = 0; i < this.pieces.length; ++i) {
            if (this.pieces[i] instanceof Pawn && (this.pieces[i].position.row == 0 || this.pieces[i].position.row == 7)) {
                let pos = this.pieces[i].position;
                this.pieces[i] = new Queen(this.pieces[i].id, this.color, true);
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