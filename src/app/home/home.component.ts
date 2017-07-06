import { Component, OnInit } from '@angular/core';
import { Game } from "../game/Game";
import { Player } from "../game/Player";
import { Rules } from "../game/Rules";
import { Chessboard } from "../game/Chessboard";
import { ChessboardItem } from "../game/ChessboardItem";
import { Colors } from "../game/Colors";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  fields: Field[][];
  rules: Rules;
  game: Game;
  firstClick: ChessboardItem;
  turn: Colors;
  state: string;

  constructor() {

  }

  ngOnInit() {
    this.fields = [];
    this.rules = { castling: false, time: 300000, doublePawnSkip: false, whoStarts: Colors.White };
    this.game = new Game(new Player("Gal Anonim", Colors.White, this.rules.time), new Player("Adam", Colors.Black, this.rules.time), this.rules);
    this.firstClick = null;
    this.turn = this.game.turn.color;
    this.state = "stan normalny";

    for (var i: number = 0; i < 8; i++) {
      this.fields[i] = [];
      for (var j: number = 0; j < 8; j++) {
        this.fields[i][j] = new Field(i, j);
      }
    }
    this.game.setPiecesOnBoard();
    this.boardToView(this.game.board);
    this.game.update();
    this.setEndabledForPlayer();
  }

  boardToView(board: Chessboard) {
    for (let i = 0; i < 8; ++i)
      for (let j = 0; j < 8; ++j) {
        if (this.game.board.board[i][j].piece != null) {
          this.fields[i][j].setPiece(this.game.board.board[i][j].piece.sign, this.game.board.board[i][j].piece.color);
        } else {
          this.fields[i][j].setPiece("", 0)
        }
      }
  }

  move(field: Field) {
    if (field.val != this.game.players.indexOf(this.game.turn) + 1) {
      //console.log("second");
      this.game.move(this.firstClick, this.fieldToBoardItem(field));
      this.game.changePlayer();
      this.game.update();
      this.turn = this.game.turn.color;
      this.state = this.game.check ? "Szach" : "stan normalny"
      if (this.game.end()) {
        this.state = "Szach mat";
        this.setAllDisabled();
      }
      this.setEndabledForPlayer();
      this.boardToView(this.game.board);
    } else {
      //console.log("first");
      this.setEndabledForPlayer();
      this.firstClick = this.fieldToBoardItem(field);
      if (this.firstClick.piece != null)
        for (let item of this.game.turn.moves.filter(item => item.source.piece==this.firstClick.piece)) {
          this.boardItemToField(item.target).setActive(true);
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

  private setEndabledForPlayer() {
    this.setAllDisabled();
    for (let move of this.game.turn.moves) {
      this.fields[move.source.row][move.source.col].setActive(true);
    }
  }
}

class Field {
  sign: string;
  val: number = 0;
  color: Colors = 0;
  row: number;
  col: number;
  active: boolean = false;

  constructor(row: number, col: number) {
    this.col = col;
    this.row = row;
    if (((row + col) % 2) == 0) {
      this.color = Colors.Black;
    } else {
      this.color = Colors.White;
    }
  }

  setPiece(sign: string, color: number) {
    this.sign = sign;
    this.val = color;
  }

  setActive(bool: boolean) {
    this.active = bool;
  }
}