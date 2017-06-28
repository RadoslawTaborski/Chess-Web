import { IPlayer } from "./Interface/IPlayer";
import { Chessboard } from "./Chessboard";
import { Rules } from "./Rules";
import { Colors } from "./Colors";

export class Game {
    private player1: IPlayer;
    private player2: IPlayer;
    board: Chessboard;
    rules: Rules = {castling:false, doublePawnSkip:false, time:100, whoStarts:Colors.White}
}