import { ChessboardItem } from "./ChessboardItem"
import { Colors } from "./Colors"
import { Observer } from "./Pattern/ObserverPattern"
import { IChessPiece } from "./Interface/IChessPiece"
import { IPlayer } from "./Interface/IPlayer"

export class Chessboard implements Observer {
    board: ChessboardItem[][]=[];

    constructor(){
        for(var i: number = 0; i < 8; i++) {
            this.board[i] = [];
            for(var j: number = 0; j< 8; j++) {
                this.board[i][j] = new ChessboardItem(i,j);
            }
        }
    }
    
    update(pieces: IChessPiece[]){

    }

    public setPieces(player: IPlayer){
        if(player.color==Colors.Black){
            this.setField(player.pieces[0],this.board[0][4]);
            this.setField(player.pieces[1],this.board[0][3]);
            this.setField(player.pieces[2],this.board[0][2]);
            this.setField(player.pieces[3],this.board[0][5]);
            this.setField(player.pieces[4],this.board[0][1]);
            this.setField(player.pieces[5],this.board[0][6]);
            this.setField(player.pieces[6],this.board[0][0]);
            this.setField(player.pieces[7],this.board[0][7]);
            for(let i=0; i<8;++i){
                this.setField(player.pieces[8+i],this.board[1][i]);
            }
        }else{
            this.setField(player.pieces[0],this.board[7][4]);
            this.setField(player.pieces[1],this.board[7][3]);
            this.setField(player.pieces[2],this.board[7][2]);
            this.setField(player.pieces[3],this.board[7][5]);
            this.setField(player.pieces[4],this.board[7][1]);
            this.setField(player.pieces[5],this.board[7][6]);
            this.setField(player.pieces[6],this.board[7][0]);
            this.setField(player.pieces[7],this.board[7][7]);
            for(let i=0; i<8;++i){
                this.setField(player.pieces[8+i],this.board[6][i]);
            }
        }
    }

    private setField(piece: IChessPiece, field: ChessboardItem){
        piece.position=field;
        field.piece=piece;
    }
}