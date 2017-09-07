import { Component, OnInit } from '@angular/core';
import { Game } from "../game/Game";
import { Pieces } from "../game/ChessPieces/ChessPiece";
import { PlayerHuman } from "../game/Players/PlayerHuman";
import { PlayerCPU } from "../game/Players/PlayerCPU";
import { Rules } from "../game/Rules";
import { Chessboard } from "../game/Chessboard/Chessboard";
import { ChessboardItem } from "../game/Chessboard/ChessboardItem";
import { Colors } from "../game/Colors";
import { TalkerService } from "../talker.service";
import { Observable } from 'rxjs/Rx';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [TalkerService]
})
export class HomeComponent implements OnInit {
  outputPath: string = 'http://grunwald.zapto.org';
  fields: Field[][];
  rules: Rules;
  game: Game;
  firstClick: ChessboardItem;
  turn: Colors;
  player: Colors;
  state: string;
  prom: boolean;
  log: boolean;
  end = false;
  dialog = false;
  playerId: number;
  specialPieces: string[] = [Pieces.queen, Pieces.rook, Pieces.bishop, Pieces.knight];
  subscribe;

  constructor(private talkerService: TalkerService) { }


  private makeMoveFromDescription(lastDescription: string, newDescription: string) {
    let cursor = 1;
    let first: Field;
    let second: Field;
    let fields: Field[] = [];
    let color: number = this.player == Colors.White ? 2 : 1;
    for (let i = 0; i < 8; ++i) {
      for (let j = 0; j < 8; ++j) {
        if (lastDescription[cursor] != newDescription[cursor]) {
          fields.push(this.fields[i][j]);
        }
        cursor += 3;
      }
    }
    if (fields.length == 2) {
      //console.log(fields);
      this.game.update();
      if (fields[0].val == color) {
        this.move(fields[0]);
        this.move(fields[1]);
        //console.log(this.game.turn, this.fieldToBoardItem(fields[0]), this.fieldToBoardItem(fields[1]));
        //this.game.move(this.fieldToBoardItem(fields[0]), this.fieldToBoardItem(fields[1]));
      } else {
        this.move(fields[1]);
        this.move(fields[0]);
        //console.log(this.game.turn, this.fieldToBoardItem(fields[0]), this.fieldToBoardItem(fields[1]));
        //this.game.move(this.fieldToBoardItem(fields[1]), this.fieldToBoardItem(fields[0]));
        //console.log("tu");
      }
    }

    // this.game.move(first, second);
  }

  public login(id: number) {
    this.log = false;
    this.dialog = false;
    this.playerId = id;

    this.setPlayerColor();
    this.getChessState(true);
    this.subscribe = Observable.interval(1 * 1000).subscribe(x => {
      this.getChessState(false);
    });
  }

  public setPlayerColor() {
    var requestData = {
      tool: "chess",
      id: "1",
      password: "1234",
      playerId: this.playerId,
      command: "login"
    }
    this.talkerService.requestPostObservable(this.outputPath + ':81/test.php', requestData).subscribe((data) => {
     // console.log("kolor gracza: " + data);
      this.player = data == "White" ? Colors.White : Colors.Black;
    });
  }

  public getChessState(first: boolean) {
    var requestData = {
      tool: "chess",
      id: "1",
      password: "1234",
      command: "get"
    }
    this.talkerService.requestPostObservable(this.outputPath + ':81/test.php', requestData).subscribe((data) => {
      if (!first) {
        if (data.turn == Colors[this.player]) {
          //console.log("moja kolej");
          this.subscribe.unsubscribe();
          this.game.update();
          this.setEndabledForPlayer();
        }
        this.makeMoveFromDescription(this.game.getDescription(), data.state);
      } else {
        this.game.setGameFromDescription(data.state);
        this.boardToView(this.game.board);
       // console.log("stan: " + Colors[this.turn] + " " + data.turn)
        if (Colors[this.turn] != data.turn) {
         // console.log("first getChessState")
          this.changePlayer();
        }
        if (data.turn == Colors[this.player]) {
        //  console.log("moja kolej")
          this.game.update();
          this.setEndabledForPlayer();
        }
      }
    });
  }

  public setChessState() {
    var requestData = {
      tool: "chess",
      id: "1",
      password: "1234",
      command: "set",
      setData: this.game.getDescription(),
      turn: this.player == Colors.White ? "Black" : "White"
    }
    this.talkerService.requestPostObservable(this.outputPath + ':81/test.php', requestData).subscribe();
  }

  ngOnInit() {
    this.fields = [];
    this.rules = { castling: false, time: 300000, doublePawnSkip: false, whoStarts: Colors.White };
    this.game = new Game(new PlayerHuman("gracz", Colors.White, Rules.time), new PlayerHuman("gracz2", Colors.Black, Rules.time), this.rules);
    this.firstClick = null;
    this.turn = this.game.turn.color;
    this.state = "stan normalny";
    this.prom = false;

    for (var i: number = 0; i < 8; i++) {
      this.fields[i] = [];
      for (var j: number = 0; j < 8; j++) {
        this.fields[i][j] = new Field(i, j);
      }
    }

    this.log = true;
    this.dialog = true;
    this.game.setPiecesOnBoard(); //TODO: niektóre linijki nie potrzebne prawdopodobnie
    this.boardToView(this.game.board);
    // this.game.update();
    // this.setEndabledForPlayer();
  }

  boardToView(board: Chessboard) {
    for (let i = 0; i < 8; ++i)
      for (let j = 0; j < 8; ++j) {
        if (this.game.board.board[i][j].piece != null) {
          this.fields[i][j].setPiece(this.game.board.board[i][j].piece.sign, this.game.board.board[i][j].piece.type(), this.game.board.board[i][j].piece.color);
        } else {
          this.fields[i][j].setPiece("", "", 0)
        }
      }
  }

  changePlayer() {
    this.game.changePlayer();
    this.game.update();
    this.turn = this.game.turn.color;
    this.state = this.game.check ? "Szach" : "stan normalny"
    if (this.game.end() == 1) {
      this.state = "Szach mat";
      this.end = true;
      this.dialog = true;
      this.setAllDisabled();
    }
    if (this.game.end() == 2) {
      this.state = "Pat";
      this.end = true;
      this.dialog = true;
      this.setAllDisabled();
    }
    if (this.player == this.turn) {
      //console.log("changePlayer")
      this.setEndabledForPlayer();
    }
    this.boardToView(this.game.board);
  }

  promotion(piece: string) {
    this.game.promotionPawn(piece);
    this.changePlayer();
    this.prom = false;
    //this.cpuMove();
    this.dialog = false;
  }

  move(field: Field) {
    if (field.val != this.game.players.indexOf(this.game.turn) + 1) {
      this.game.move(this.firstClick, this.fieldToBoardItem(field));
      field.click = true;
      if (this.game.isPromotion()) {
        this.state = "Promocja pionka";
        this.prom = true;
        this.setAllDisabled();
        this.boardToView(this.game.board);
        this.dialog = true;
        return;
      }
      if (this.player==this.turn){
        this.setChessState();
        //this.getChessState(false);
        this.subscribe = Observable.interval(1 * 1000).subscribe(x => {
          this.getChessState(false);
        });
      }
      this.setAllDisabled();
      this.changePlayer();
      //this.cpuMove();
      this.boardToView(this.game.board);  
    } else {
      this.setEndabledForPlayer();
      this.firstClick = this.fieldToBoardItem(field);
      this.unclickAll();
      field.click = true;
     // console.log(this.firstClick);
      if (this.firstClick.piece != null)
        for (let item of this.game.turn.moves.filter(item => item.source.piece == this.firstClick.piece)) {
          this.boardItemToField(item.target).setActive(true);
        }
    }
  }

  cpuMove() {
    if (!this.end) {
      if (this.game.turn instanceof PlayerCPU) {
        let move = this.game.turn.getMove(this.game.board, this.game.pause);
        this.unclickAll();
        this.boardItemToField(move.source).click = true;
        this.boardItemToField(move.target).click = true;
        this.game.move(move.source, move.target);
        if (this.game.isPromotion()) {
          this.game.promotionPawn(Pieces.queen);
        }
        this.changePlayer();
      }
    }
  }

  fieldToBoardItem(field: Field): ChessboardItem {
    return this.game.board.board[field.row][field.col];
  }

  boardItemToField(boardItem: ChessboardItem): Field {
    return this.fields[boardItem.row][boardItem.col];
  }

  private setAllDisabled() {
    for (let i = 0; i < 8; ++i)
      for (let j = 0; j < 8; ++j) {
        this.fields[i][j].setActive(false);
      }
  }

  private unclickAll() {
    for (let i = 0; i < 8; ++i)
      for (let j = 0; j < 8; ++j) {
        this.fields[i][j].click = false;
      }
  }

  private setEndabledForPlayer() {
    this.setAllDisabled();
    for (let move of this.game.turn.moves) {
      this.fields[move.source.row][move.source.col].setActive(true);
    }
  }

  close(){
    this.dialog=false;
  }
}

class Field {
  sign: string;
  val: number = 0;
  color: Colors = 0;
  row: number;
  col: number;
  type: string;
  active: boolean = false;
  click: boolean = false;

  constructor(row: number, col: number) {
    this.col = col;
    this.row = row;
    if (((row + col) % 2) == 0) {
      this.color = Colors.Black;
    } else {
      this.color = Colors.White;
    }
  }

  setPiece(sign: string, type: string, color: number) {
    this.sign = sign;
    this.val = color;
    this.type = type;
  }

  setActive(bool: boolean) {
    this.active = bool;
  }
}