import { IPlayer } from "./Interface/IPlayer";
import { IChessPiece } from "./Interface/IChessPiece";
import { IMove, Type } from "./Interface/IMove";
import { Chessboard } from "./Chessboard/Chessboard";
import { ChessboardItem } from "./Chessboard/ChessboardItem";
import { Move } from "./Move";
import { Rules } from "./Rules";
import { Colors } from "./Colors";

export class Game {
    players: IPlayer[]=[];
    board: Chessboard;
    turn: IPlayer;
    pause: IPlayer;
    check: boolean=false;
    promotion: boolean=false;

    constructor(player1: IPlayer, player2: IPlayer, rules: Rules){
        this.players.push(player1);
        this.players.push(player2);
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
        return (this.players[0].color==Rules.whoStarts)?true:false;
    }

    isPromotion(): boolean{
        return this.promotion;
    }

    promotionPawn(piece: string){
        this.turn.promotionPawn(this.board, piece);
    }

    move(first:ChessboardItem, second:ChessboardItem){
        let move=this.findMove(first,second);
        //console.log(first, second);
        if(move.type==Type.Capture){
            this.Capture(this.pause,move.target.piece);
            this.moveWithoutCapture(move);
            this.promotion=this.turn.isPromotion(this.board);
        }
        if(move.type==Type.Castle){
            let newMove:IMove=null;
            if(move.target.col==2){
                newMove=new Move(this.board.getField(move.target.row,0),this.board.getField(move.target.row,3),Type.Ordinary);
            }else{
                newMove=new Move(this.board.getField(move.target.row,7),this.board.getField(move.target.row,5),Type.Ordinary);
            }
            this.moveWithoutCapture(move);
            this.moveWithoutCapture(newMove);
        }
        if(move.type==Type.Ordinary){
            this.moveWithoutCapture(move);
            this.promotion=this.turn.isPromotion(this.board);
        }       
    }

    moveWithoutCapture(move: IMove){
        move.target.piece=move.source.piece;
        let index=this.turn.pieces.indexOf(move.target.piece);
        this.turn.pieces[index].changePosiotion(move.target);
        move.source.piece=null;
    }

    findMove(first:ChessboardItem, second:ChessboardItem): IMove{
        let move=this.turn.moves.filter(item => item.source == first);
        move=move.filter(item => item.target == second);
        return move[0];
    }

    end(): number{
        if(this.check && this.turn.moves.length==0){ 
            return 1; //szach mat
        } else if(this.turn.moves.length==0){
            return 2; //remis
        }
        return 0;
    }

    getDescription(): string{
        return this.board.createDescription();
    }

    setGameFromDescription(description: string): void{
        if(this.turn.color==Colors.Black)
            this.board.setPiecesFromDescription(description,this.turn,this.pause);
        else{
            this.board.setPiecesFromDescription(description,this.pause,this.turn);
        }
    }

    private Capture(player: IPlayer, piece: IChessPiece){
        let index=player.pieces.indexOf(piece);
        player.pieces.splice(index,1);
    }
}