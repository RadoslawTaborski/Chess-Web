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
    promotion: boolean=false;

    constructor(player1: IPlayer, player2: IPlayer, rules: Rules){
        this.players.push(player1);
        this.players.push(player2);
        this.rules=rules;
        this.board=new Chessboard();
        this.players[0].addObserver(this.board);
        this.players[0].addObserver(this.players[0]);
        this.players[1].addObserver(this.board);
        this.players[1].addObserver(this.players[1]);
        this.turn=this.firstPlayerStarts()?this.players[0]:this.players[1];
        this.pause=this.firstPlayerStarts()?this.players[1]:this.players[0];
    }

    setPiecesOnBoard(){
        this.board.setInitialPieces(this.players[0]);
        this.board.setInitialPieces(this.players[1]);
    }

    update(){
        this.turn.updateMoves(this.board,this.pause);
    }

    changePlayer(){
        this.check=this.turn.isChecking(this.board);
        //console.log(this.check);
        let tmp=this.turn;
        this.turn=this.pause;
        this.pause=tmp;
    }

    firstPlayerStarts(): boolean {
        return (this.players[0].color==this.rules.whoStarts)?true:false;
    }

    isPromotion(): boolean{
        return this.promotion;
    }

    promotionPawn(piece: string){
        this.turn.promotionPawn(this.board, piece);
        console.log(piece);
    }

    move(first:ChessboardItem, second:ChessboardItem, piece?: string){
        //console.log(first, second);
        if(second.piece!=null){
            this.Capture(this.pause,second.piece);
        }
        second.piece=first.piece;
        let index=this.turn.pieces.indexOf(second.piece);
        this.turn.pieces[index].changePosiotion(second);
        first.piece=null;
        this.promotion=this.turn.isPromotion(this.board);
    }

    end(): boolean{
        if(this.check && this.turn.moves.length==0){ //TODO: może być również opcja z zasłonięciem króla :(
            return true;
        }
        return false;
    }

    private Capture(player: IPlayer, piece: IChessPiece){
        let index=player.pieces.indexOf(piece);
        player.pieces.splice(index,1);
    }
}