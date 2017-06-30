import { IPlayer } from "./Interface/IPlayer";
import { Chessboard } from "./Chessboard";
import { Rules } from "./Rules";
import { Colors } from "./Colors";

export class Game {
    private players: IPlayer[]=[];
    board: Chessboard;
    rules: Rules; 
    end: boolean=false;

    constructor(player1: IPlayer, player2: IPlayer, rules: Rules){
        this.players.push(player1);
        this.players.push(player2);
        this.rules=rules;
        this.board=new Chessboard();
    }

    setPiecesOnBoard(){
        this.board.setPieces(this.players[0]);
        this.board.setPieces(this.players[1]);
    }

    play(){
        let turn=this.firstPlayerStarts();
        while(!this.end){
            let index=turn?0:1;
            this.players[index].updateMoves(this.board);
            this.players[index].makeMove();
            turn=!turn;
        }
    }

    firstPlayerStarts(): boolean {
        if(this.players[0].color==this.rules.whoStarts){
            return true;
        }else{
            return false;
        }
    }
}