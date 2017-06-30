import { IPlayer } from "./Interface/IPlayer";
import { Chessboard } from "./Chessboard";
import { ChessboardItem } from "./ChessboardItem";
import { Rules } from "./Rules";
import { Colors } from "./Colors";

export class Game {
    players: IPlayer[]=[];
    board: Chessboard;
    rules: Rules; 
    end: boolean=false;
    turn: IPlayer;
    pause: IPlayer;

    constructor(player1: IPlayer, player2: IPlayer, rules: Rules){
        this.players.push(player1);
        this.players.push(player2);
        this.rules=rules;
        this.board=new Chessboard();
        this.turn=this.firstPlayerStarts()?this.players[0]:this.players[1];
        this.pause=this.firstPlayerStarts()?this.players[1]:this.players[0];
    }

    setPiecesOnBoard(){
        this.board.setPieces(this.players[0]);
        this.board.setPieces(this.players[1]);
    }

    update(){
        this.turn.updateMoves(this.board);
    }

    changePlayer(){
        let tmp=this.turn;
        this.turn=this.pause;
        this.pause=tmp;
    }

    firstPlayerStarts(): boolean {
        if(this.players[0].color==this.rules.whoStarts){
            return true;
        }else{
            return false;
        }
    }

    move(first:ChessboardItem, second:ChessboardItem){
        console.log(first, second);
        if(second.piece!=null){
            let index=this.turn.pieces.indexOf(second.piece);
            this.pause.pieces.splice(index,1);
            second.piece=null;
            console.log(first, second);
        }
        second.piece=first.piece;
        console.log(first, second);
        let index=this.turn.pieces.indexOf(second.piece);
        this.turn.pieces[index].position=second;
        first.piece=null;
        console.log(first, second);
        console.log(this.board.board)
    }
}