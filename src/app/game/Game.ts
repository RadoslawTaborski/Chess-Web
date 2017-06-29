import { IPlayer } from "./Interface/IPlayer";
import { Chessboard } from "./Chessboard";
import { Rules } from "./Rules";
import { Colors } from "./Colors";

export class Game {
    private player1: IPlayer;
    private player2: IPlayer;
    board: Chessboard;
    rules: Rules; 

    constructor(player1: IPlayer, player2: IPlayer, rules: Rules){
        this.player1=player1;
        this.player2=player2;
        this.rules=rules;
        this.board=new Chessboard();
    }

    setPiecesOnBoard(){
        this.board.setPieces(this.player1);
        this.board.setPieces(this.player2);
    }

    play(){

    }
}