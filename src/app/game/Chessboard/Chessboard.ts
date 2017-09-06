import { ChessboardItem } from "./ChessboardItem"
import { Colors } from "../Colors"
import { Observer, Observed } from "../Pattern/ObserverPattern"
import { IChessPiece } from "../Interface/IChessPiece"
import { Pieces } from "../ChessPieces/ChessPiece"
import { IPlayer } from "../Interface/IPlayer"
import { IMove, Type } from "../Interface/IMove"

export class Chessboard implements Observer {
    board: ChessboardItem[][] = [];

    constructor(board?: Chessboard) {
        if (typeof board === "object") {
            for (var i: number = 0; i < 8; i++) {
                this.board[i] = [];
                for (var j: number = 0; j < 8; j++) {
                    this.board[i][j] = new ChessboardItem(board.board[i][j]);
                }
            }
        } else {
            for (var i: number = 0; i < 8; i++) {
                this.board[i] = [];
                for (var j: number = 0; j < 8; j++) {
                    this.board[i][j] = new ChessboardItem(i, j);
                }
            }
        }
    }

    private instanceOfIPlayer(object: any): object is IPlayer {
        return object.name !== undefined;
    }

    update(o: Observed) {
        if (this.instanceOfIPlayer(o)) {
            // console.log(o);
            for (let piece of o.pieces) {
                //   console.log("tutaj ");
                this.board[piece.position.row][piece.position.col].piece = piece;
            }
        }
    }

    public setInitialPieces(player: IPlayer) {
        if (player.color == Colors.Black) {
            this.setField(player.pieces[0], this.board[0][4]);
            this.setField(player.pieces[1], this.board[0][3]);
            this.setField(player.pieces[2], this.board[0][2]);
            this.setField(player.pieces[3], this.board[0][5]);
            this.setField(player.pieces[4], this.board[0][1]);
            this.setField(player.pieces[5], this.board[0][6]);
            this.setField(player.pieces[6], this.board[0][0]);
            this.setField(player.pieces[7], this.board[0][7]);
            for (let i = 0; i < 8; ++i) {
                this.setField(player.pieces[8 + i], this.board[1][i]);
            }
        } else {
            this.setField(player.pieces[0], this.board[7][4]);
            this.setField(player.pieces[1], this.board[7][3]);
            this.setField(player.pieces[2], this.board[7][2]);
            this.setField(player.pieces[3], this.board[7][5]);
            this.setField(player.pieces[4], this.board[7][1]);
            this.setField(player.pieces[5], this.board[7][6]);
            this.setField(player.pieces[6], this.board[7][0]);
            this.setField(player.pieces[7], this.board[7][7]);
            for (let i = 0; i < 8; ++i) {
                this.setField(player.pieces[8 + i], this.board[6][i]);
            }
        }
    }

    public setPiecesFromDescription(description: string, blackPlayer: IPlayer, whitePlayer: IPlayer) { //TODO obsłużyć awans pionków
        let black = "rnlqkp";
        let white = "RNLQKP";
        let position = -1;
        for (var i = 0, len = description.length; i < len; i++) {
            ++position;
            let row = Math.floor(position / 8);
            let column = position - row * 8;
            if (description[i] == ".") {
                this.board[row][column].piece = null;
                i+=2;
                continue;
            }
            if (black.indexOf(description[i]) != -1) {
                ++i;
                let pieceId = parseInt(description[i], 16)+1;
                let piece=blackPlayer.pieces.filter(x=>x.id===pieceId)[0];
                this.setField(piece, this.board[row][column]);
                ++i;
                if (description[i] == "+")
                    piece.firstmove = false;
            } else {
                ++i;
                let pieceId = parseInt(description[i], 16)+1;
                let piece=whitePlayer.pieces.filter(x=>x.id===pieceId)[0];
                this.setField(piece, this.board[row][column]);
                ++i;
                if (description[i] == "+"){
                    piece.firstmove = false;
                }
            }
        }
    }

    public createDescription(): string { //TODO: do innego pliku
        let result: string = "";
        for (let i = 0; i < 8; ++i) {
            for (let j = 0; j < 8; ++j) {
                if (this.board[i][j].piece == null) {
                    result += ".X.";
                    continue;
                }
                result+=this.pieceToSign(this.board[i][j].piece);
                result+=(this.board[i][j].piece.id-1).toString(16);
                result+=this.board[i][j].piece.firstmove?"-":"+";
            }
        }
        return result;
    }

    private pieceToSign(piece: IChessPiece): string {
        if (piece.color == Colors.Black) {
            switch (piece.sign) {
                case Pieces.pawn:
                    return "p";
                case Pieces.rook:
                    return "r";
                case Pieces.knight:
                    return "n";
                case Pieces.bishop:
                    return "l";
                case Pieces.queen:
                    return "q";
                case Pieces.king:
                    return "k";
            }
        } else {
            switch (piece.sign) {
                case Pieces.pawn:
                    return "P";
                case Pieces.rook:
                    return "R";
                case Pieces.knight:
                    return "N";
                case Pieces.bishop:
                    return "L";
                case Pieces.queen:
                    return "Q";
                case Pieces.king:
                    return "K";
            }
        }
    }

    public setPieces(player: IPlayer) {
        for (let piece of player.pieces) {
            this.setField(piece, this.board[piece.position.row][piece.position.col]);
        }
    }

    getField(row: number, col: number): ChessboardItem {
        if (row >= 0 && row < 8 && col >= 0 && col < 8)
            return this.board[row][col];
        return null;
    }

    private setField(piece: IChessPiece, field: ChessboardItem) {
        //console.log(piece);
        piece.position = field;
        field.piece = piece;
    }
}