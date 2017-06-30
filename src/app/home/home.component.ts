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
  fields: Field[][] = [];
  rules: Rules = { castling: false, time: 300000, doublePawnSkip: false, whoStarts: Colors.White };
  game: Game = new Game(new Player("Gal Anonim", Colors.White, this.rules.time), new Player("Adam", Colors.Black, this.rules.time), this.rules);
  endMove: boolean = false;
  firstClick: ChessboardItem = null;

  constructor() { }

  ngOnInit() {
    for (var i: number = 0; i < 8; i++) {
      this.fields[i] = [];
      for (var j: number = 0; j < 8; j++) {
        this.fields[i][j] = new Field(i, j);
      }
    }
    this.game.setPiecesOnBoard();
    this.boardToView(this.game.board);
    this.setEndabledForPlayer();
  }

  boardToView(board: Chessboard) {
    for (let i = 0; i < 8; ++i)
      for (let j = 0; j < 8; ++j) {
        if (this.game.board.board[i][j].piece != null) {
          this.fields[i][j].setPiece(this.game.board.board[i][j].piece.sign, this.game.board.board[i][j].piece.color);
        }else{
          this.fields[i][j].setPiece("",0)
        }
      }
  }

  move(field: Field) {
    if (field.val != this.game.players.indexOf(this.game.turn) + 1) {
      console.log("second");
      this.game.move(this.firstClick, this.fieldToBoardItem(field));
      this.endMove = true;
      this.game.changePlayer();
      this.setEndabledForPlayer();
      this.boardToView(this.game.board);
    } else {
      console.log("first");
      this.setEndabledForPlayer();
      this.game.update();
      this.firstClick = this.fieldToBoardItem(field);
      if (this.firstClick .piece != null)
        for (let item of this.firstClick .piece.moves) {
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
    for (let i = 0; i < 8; ++i)
      for (let j = 0; j < 8; ++j) {
        let tmp = this.fields[i][j];
        if (tmp.val == this.game.players.indexOf(this.game.turn) + 1)
          tmp.setActive(true);
        else {
          tmp.setActive(false);
        }
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