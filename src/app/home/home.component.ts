import { Component, OnInit } from '@angular/core';
import { Game } from "../game/Game";
import { Player } from "../game/Player";
import { Rules } from "../game/Rules";
import { Colors } from "../game/Colors";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  fields: string[][]=[];
  rules: Rules={castling: false, time: 300000, doublePawnSkip: false, whoStarts: Colors.White};
  game: Game= new Game(new Player("Gal Anonim", Colors.White, this.rules.time),new Player("Adam", Colors.Black, this.rules.time), this.rules);

  constructor() { }

  ngOnInit() {
    for(var i: number = 0; i < 8; i++) {
      this.fields[i] = [];
      for(var j: number = 0; j< 10; j++) {
          this.fields[i][j] = "";
      }
    }
  }

}
