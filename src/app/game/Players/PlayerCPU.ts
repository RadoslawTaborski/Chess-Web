import { IPlayer } from "../Interface/IPlayer"
import { Observer, Observed } from "../Pattern/ObserverPattern"
import { IChessPiece } from "../Interface/IChessPiece"
import { ChessPiece, Pieces } from "../ChessPieces/ChessPiece"
import { Pawn } from "../ChessPieces/Pawn"
import { Rook } from "../ChessPieces/Rook"
import { Bishop } from "../ChessPieces/Bishop"
import { Knight } from "../ChessPieces/Knight"
import { Queen } from "../ChessPieces/Queen"
import { King } from "../ChessPieces/King"
import { Colors } from "../Colors"
import { ChessboardItem } from "./../Chessboard/ChessboardItem"
import { Chessboard } from "./../Chessboard/Chessboard";
import { Move } from "../Move"
import { IMove, Type } from "../Interface/IMove"
import { PlayerHuman } from "./PlayerHuman"
import { Player } from "./Player"


export class PlayerCPU extends Player {

    constructor(playerOrName: IPlayer | string, color?: Colors, time?: number) {
        if (typeof playerOrName === "object") {
            super(playerOrName);
        } else if (typeof playerOrName === "string" && typeof color === "number" && typeof time === "number") {
            super(playerOrName, color, time);
        }
    }

    private rateMove(board: Chessboard, player: IPlayer, opponent: IPlayer, move: IMove, parent: Situation): Situation {
        let boardCopy = new Chessboard();
        let opponentCopy = new PlayerHuman(opponent);
        let thisCopy = new PlayerHuman(player);
        boardCopy.setPieces(opponentCopy);
        boardCopy.setPieces(thisCopy);
        let target = boardCopy.board[move.target.row][move.target.col];
        let source = boardCopy.board[move.source.row][move.source.col];
        let newMove = new Move(source, target, move.type);

        if (newMove.type == Type.Capture) {
            this.Capture(opponentCopy, newMove.target.piece);
            this.moveWithoutCapture(thisCopy, newMove);
            if (thisCopy.isPromotion(boardCopy)) {
                thisCopy.promotionPawn(boardCopy, Pieces.queen); //TODO: niekoniecznie queen
            }
        }
        if (newMove.type == Type.Castle) {
            let newMove2: IMove = null;
            if (newMove.target.col == 2) {
                newMove2 = new Move(boardCopy.getField(newMove.target.row, 0), boardCopy.getField(newMove.target.row, 3), Type.Ordinary);
            } else {
                newMove2 = new Move(boardCopy.getField(newMove.target.row, 7), boardCopy.getField(newMove.target.row, 5), Type.Ordinary);
            }
            this.moveWithoutCapture(thisCopy, newMove);
            this.moveWithoutCapture(thisCopy, newMove2);
        }
        if (newMove.type == Type.Ordinary) {
            this.moveWithoutCapture(thisCopy, newMove);
            if (thisCopy.isPromotion(boardCopy)) {
                thisCopy.promotionPawn(boardCopy, Pieces.queen); //TODO: niekoniecznie queen
            }
        }

        let result: number = 0;
        for (var i: number = 0; i < 8; i++) {
            for (var j: number = 0; j < 8; j++) {
                if (boardCopy.board[i][j].piece != null) {
                    if (boardCopy.board[i][j].piece.color == player.color) {
                        result += this.getValue(boardCopy.board[i][j].piece);
                    } else {
                        result -= this.getValue(boardCopy.board[i][j].piece);
                    }
                }
            }
        }
        result+=player.isChecking(boardCopy)?3:0;

        return new Situation(boardCopy, thisCopy, opponentCopy, parent, move, result);
    }

    private getValue(piece: IChessPiece) {
        switch (piece.sign) {
            case Pieces.queen: {
                return Values.queen;
            }
            case Pieces.king: {
                return Values.king;
            }
            case Pieces.rook: {
                return Values.rook;
            }
            case Pieces.bishop: {
                return Values.bishop;
            }
            case Pieces.knight: {
                return Values.knight;
            }
            case Pieces.pawn: {
                return Values.pawn;
            }
            default: {
                return 0;
            }
        }
    }

    getMove(board: Chessboard, opponent: IPlayer): IMove {
        let root: Situation = new Situation(board, opponent, this, null, null, 0);
        this.setTree(root);
        for (let child of root.children) {
            this.setTree(child);
            for (let child2 of child.children) {
                child2.findMinChildren();
            }
            child.findMaxChildren();
        }
        root.findMinChildren();
  
        let moves = root.children.filter(item => item.val == root.val);
        let index = Math.floor(Math.random() * moves.length);
        return moves[index].move;
    }

    setTree(root: Situation) {
        root.opponent.updateMoves(root.board, root.player);
        for (let move of root.opponent.moves) {
            root.children.push(this.rateMove(root.board, root.opponent, root.player, move, root));
        }
    }
}

class Values {
    static king: number = 2000;
    static queen: number = 9;
    static rook: number = 5;
    static knight: number = 3;
    static bishop: number = 3;
    static pawn: number = 1;
}

class Situation {
    parent: Situation = null;
    board: Chessboard;
    player: IPlayer;
    opponent: IPlayer;
    move: IMove;
    rate: number;
    val: number = Number.MAX_VALUE;
    children: Situation[];

    constructor(board: Chessboard, player: IPlayer, opponent: IPlayer, parent: Situation, move: IMove, rate: number) {
        this.board = board;
        this.player = player;
        this.opponent = opponent;
        this.move = move;
        this.rate = rate;
        this.children = [];
        this.parent = parent;
    }

    findMinChildren() { 
        if (this.children.length == 0) {
            this.val = this.rate;
        } else {
            this.val = Math.min.apply(Math, this.children.map(function (o) { return o.val; }));
        }
    }

    findMaxChildren() {
        if (this.children.length == 0) {
            this.val = this.rate;
        } else {
            this.val = Math.max.apply(Math, this.children.map(function (o) { return o.val; }));
        }
    }

}