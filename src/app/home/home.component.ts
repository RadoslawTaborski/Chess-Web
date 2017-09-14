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
import { Md5 } from 'ts-md5/dist/md5';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [TalkerService, Md5]
})
export class HomeComponent implements OnInit {
  outputPath: string = 'http://grunwald.zapto.org';
  fields: Field[][];
  rules: Rules;
  game: Game;
  firstClick: ChessboardItem;
  turn: Colors;
  player: Colors;
  state: string = "Logowanie";
  prom: boolean = false;
  log: boolean = true;
  logOK: boolean = true;
  reg: boolean = false;
  regOK: boolean = true;
  gameChooser: boolean = false;
  gameCreator: boolean = false;
  games: any;
  players: any;
  nickname: string = "";
  gameID: number = 0;
  playerID: number = 0;
  firstTurn: boolean = false;
  moveCounter: number = 0;
  end = false;
  dialog = true;
  promotionPiece: string = "";
  specialPieces: string[] = [Pieces.queen, Pieces.rook, Pieces.bishop, Pieces.knight];
  subscribe;
  interval: number = 0.8;

  constructor(private talkerService: TalkerService, private _md5: Md5) { }


  private makeMoveFromDescription(lastDescription: string, newDescription: string) {
    if (newDescription.length > 192) {
      this.promotionPiece = newDescription.substring(192, newDescription.length);
      //console.log(this.promotionPiece);
    }
    let cursor = 0;
    let first: Field;
    let second: Field;
    let black = "rnlqkp";
    let white = "RNLQKP";
    let fields: Field[] = [];
    let color: number = this.player == Colors.White ? 2 : 1;
    for (let i = 0; i < 8; ++i) {
      for (let j = 0; j < 8; ++j) {
        //console.log(lastDescription[cursor] + " " + newDescription[cursor])
        if (lastDescription[cursor] != newDescription[cursor]) {
          if (black.indexOf(lastDescription[cursor]) != -1 && black.indexOf(newDescription[cursor]) != -1 || white.indexOf(lastDescription[cursor]) != -1 && white.indexOf(newDescription[cursor]) != -1) {

          } else {
            fields.push(this.fields[i][j]);
          }
        }
        cursor += 3;
      }
    }
    //console.log(fields)
    if (fields.length == 2) {
      //console.log(fields);
      this.game.update();
      if (fields[0].val == color) {
        this.move(fields[0]);
        this.move(fields[1]);
      } else {
        this.move(fields[1]);
        this.move(fields[0]);
      }
    }
    if (fields.length == 4) {
      //console.log(fields)
      if (fields[0].type == "king") {
        this.move(fields[0]);
        this.move(fields[2]);
      } else {
        this.move(fields[3]);
        this.move(fields[1]);
      }
    }
    if (fields.length < 2) {
      this.getChessState(false);
      this.subscribe = Observable.interval(this.interval * 1000).subscribe(x => {
        this.getChessState(false);
      });
      //console.log("REPLAY");
    }
  }

  public login(nickname: string, password: string) {
    let hash = Md5.hashStr(password + nickname);
    //console.log(hash);

    var requestData = {
      tool: "chess",
      login: nickname,
      playerPassword: hash,
      command: "login"
    }
    //console.log(requestData);
    this.talkerService.requestPostObservable(this.outputPath + ':81/test.php', requestData).subscribe((data) => {
      //console.log(data);
      if (data != "ERROR") {
        this.log = false;
        this.logOK = true;
        this.playerID = data;
        this.nickname = nickname;
        this.getPlayerGames();
      } else {
        this.logOK = false;
      }
    });
  }

  public register(nickname: string, password: string) {
    let hash = Md5.hashStr(password + nickname);
    //console.log(hash);

    var requestData = {
      tool: "chess",
      login: nickname,
      playerPassword: hash,
      command: "register"
    }
    //console.log(requestData);
    this.talkerService.requestPostObservable(this.outputPath + ':81/test.php', requestData).subscribe((data) => {
      //console.log(data);
      if (data == "OK") {
        this.regOK = true;
        this.reg = false;
        this.log = true;
        this.logOK = true;
      } else {
        this.regOK = false;
      }
    });
  }

  public getPlayerGames() {
    this.dialog=true;
    this.gameChooser = true;
    this.gameCreator = false;
    this.state = "Wybór gry";

    var requestData = {
      tool: "chess",
      login: this.nickname,
      command: "getGames"
    }
    this.talkerService.requestPostObservable(this.outputPath + ':81/test.php', requestData).subscribe((data) => {
      //console.log(data);
      this.games = data;
    });
  }

  public getOpponents() {
    this.gameChooser = false;
    this.gameCreator = true;
    this.state = "Tworzenie nowej gry";

    var requestData = {
      tool: "chess",
      login: this.nickname,
      command: "getPlayers"
    }
    this.talkerService.requestPostObservable(this.outputPath + ':81/test.php', requestData).subscribe((data) => {
      //console.log(data);
      this.players = data;
    });
  }

  public setPlayerColor(id: number) {
    this.ngOnInit();
    var requestData = {
      tool: "chess",
      id: id,
      login: this.nickname,
      command: "getPlayerColor"
    }
    this.talkerService.requestPostObservable(this.outputPath + ':81/test.php', requestData).subscribe((data) => {
      //console.log(data);
      if (data != 'ERROR') {
        this.gameChooser=false;
        this.gameID = id;
        this.player = data == "White" ? Colors.White : Colors.Black;
        this.getChessState(true);
        this.subscribe = Observable.interval(this.interval * 1000).subscribe(x => {
          this.getChessState(false);
        });
        this.dialog = false;
      }
    });
  }

  public getChessState(first: boolean) {
    var requestData = {
      tool: "chess",
      id: this.gameID,
      command: "get"
    }
    this.talkerService.requestPostObservable(this.outputPath + ':81/test.php', requestData).subscribe((data) => {
      if (!first) {
        //console.log("geetChessState: " + data.turn);
        if (data.turn == Colors[this.player]) {
          //console.log("moja kolej");
          //console.log(data.turn + " " + Colors[this.player])
          this.subscribe.unsubscribe();
          this.game.update();
          this.setEndabledForPlayer();
          if (this.firstTurn) {
            this.makeMoveFromDescription(this.game.getDescription(this.promotionPiece), data.state);
          }
        } else {
          //console.log("TRUE!!!")
          this.firstTurn = true;
        }
      } else {
        this.game.setGameFromDescription(data.state);
        this.boardToView(this.game.board);
        ////console.log("stan: " + Colors[this.turn] + " " + data.turn)
        if (Colors[this.turn] != data.turn) {
          ////console.log("first getChessState")
          this.changePlayer();
        }
        if (data.turn == Colors[this.player]) {
          // //console.log("moja kolej")
          this.game.update();
          this.setEndabledForPlayer();
        }
      }
    });
  }

  public createNewGame(id: number, color: string) {

    var requestData = {
      tool: "chess",
      command: "newGame",
      player1: this.playerID,
      player2: id,
      color: color,
    }
    this.talkerService.requestPostObservable(this.outputPath + ':81/test.php', requestData).subscribe(data => {
      //console.log(data);
      if (data == "OK") {
        this.gameCreator = false;
        this.getPlayerGames();
      }
    });
  }

  public setChessState() {
    var requestData = {
      tool: "chess",
      id: this.gameID,
      command: "set",
      setData: this.game.getDescription(this.promotionPiece),
      turn: this.player == Colors.White ? "Black" : "White",
      end: (this.end?1:0).toString(),
    }
    console.log(requestData);
    this.talkerService.requestPostObservable(this.outputPath + ':81/test.php', requestData).subscribe();
  }

  ngOnInit() {
    this.fields = [];
    this.rules = { castling: false, time: 300000, doublePawnSkip: false, whoStarts: Colors.White };
    this.game = new Game(new PlayerHuman("gracz", Colors.White, Rules.time), new PlayerHuman("gracz2", Colors.Black, Rules.time), this.rules);
    this.firstClick = null;
    this.turn = this.game.turn.color;

    for (var i: number = 0; i < 8; i++) {
      this.fields[i] = [];
      for (var j: number = 0; j < 8; j++) {
        this.fields[i][j] = new Field(i, j);
      }
    }

    this.game.setPiecesOnBoard();
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
      this.setChessState();
    }
    if (this.game.end() == 2) {
      this.state = "Pat";
      this.end = true;
      this.dialog = true;
      this.setAllDisabled();
      this.setChessState();
    }
    if (this.player == this.turn) {
      //console.log("changePlayer")
      this.setEndabledForPlayer();
    }
    this.boardToView(this.game.board);
  }

  promotion(piece: string) {
    this.game.promotionPawn(piece);
    this.prom = false;
    //this.cpuMove();
    this.dialog = false;
    this.promotionPiece = piece;
    if (this.player == this.turn) {
      this.setChessState();
      this.promotionPiece = "";
      //this.getChessState(false);
      this.subscribe = Observable.interval(this.interval * 1000).subscribe(x => {
        this.getChessState(false);
      });
    }
    this.setAllDisabled();
    this.changePlayer();
    //this.cpuMove();
    this.boardToView(this.game.board);
  }

  move(field: Field) {
    if (field.val != this.game.players.indexOf(this.game.turn) + 1) {
      this.game.move(this.firstClick, this.fieldToBoardItem(field));
      field.click = true;
      this.moveCounter++;
      if (this.game.isPromotion()) {
        if (this.player == this.turn) {
          this.state = "Promocja pionka";
          this.prom = true;
          this.setAllDisabled();
          this.boardToView(this.game.board);
          this.dialog = true;
          return;
        } else {
          //console.log("promocja")
          this.game.promotionPawn(this.promotionPiece);
          this.promotionPiece = "";
        }
      }
      if (this.player == this.turn) {
        this.setChessState();
        this.promotionPiece = "";
        //this.getChessState(false);
        this.subscribe = Observable.interval(this.interval * 1000).subscribe(x => {
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
      ////console.log(this.firstClick);
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

  close() {
    this.dialog = false;
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