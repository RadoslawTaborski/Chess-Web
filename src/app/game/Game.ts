import { IPlayer } from "./Interface/IPlayer";
import { IChessPiece } from "./Interface/IChessPiece";
import { Chessboard } from "./Chessboard";
import { ChessboardItem } from "./ChessboardItem";
import { Rules } from "./Rules";
import { Colors } from "./Colors";

export class Game {
    players: IPlayer[]=[];
    board: Chessboard;
    rules: Rules; 
    turn: IPlayer;
    pause: IPlayer;
    check: boolean=false;

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
        this.turn.updateMoves(this.board,this.check);
    }

    changePlayer(){
        this.check=this.turn.isChecking(this.board);
        console.log(this.check);
        let tmp=this.turn;
        this.turn=this.pause;
        this.pause=tmp;
    }

    firstPlayerStarts(): boolean {
        return (this.players[0].color==this.rules.whoStarts)?true:false;
    }

    move(first:ChessboardItem, second:ChessboardItem){
        //console.log(first, second);
        if(second.piece!=null){
            this.Capture(this.pause,second.piece);
        }
        second.piece=first.piece;
        let index=this.turn.pieces.indexOf(second.piece);
        this.turn.pieces[index].position=second;
        first.piece=null;
    }

    end(): boolean{
        if(this.check && this.turn.pieces[0].moves.length==0){ //TODO: może być również opcja z zasłonięciem króla :(
            return true;
        }
        return false;
    }

    private Capture(player: IPlayer, piece: IChessPiece){
        let index=player.pieces.indexOf(piece);
            player.pieces.splice(index,1);
    }
}