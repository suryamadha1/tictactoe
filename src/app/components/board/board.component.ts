import { Component, ViewChild } from '@angular/core';
import { BehaviorSubject, EMPTY, from, map, mergeMap, Observable, of, tap } from 'rxjs';
import { Player } from 'src/app/common/player';
import { WINNING_COMBINATIONS } from 'src/app/common/rules';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent {

  @ViewChild('f') form: any;

  board$: Observable<string[]> = of(Array(9).fill(''));
  
  symbols: string[] = ['X','O']
  
  player1: Player = {} as Player;
  player2: Player = {} as Player;

  _isBoardActive: BehaviorSubject<boolean> = new BehaviorSubject(false);
  isBoardActive$: Observable<boolean> = this._isBoardActive.asObservable();
  currentPlayer: Player;

  winner: string;

  // playersDataExists: boolean = Object.keys(this.player1).length !== 0 && Object.keys(this.player2).length !== 0;


  onClickCell(index: number){
    this.board$.pipe(
      map(boardCells => of(boardCells.map((cell, i) => index !== i ? cell : this.currentPlayer.symbol))),
    )
    .subscribe(
      board => {
        this.board$ = board;
      }
    );
    this.shuffleCurrentPlayer();
    this.evaluateResult();
  }

  evaluateResult() {
    this.board$
    .subscribe(
      board => {
        let player1_Positions = board.map((cell, index) => cell === this.player1.symbol ? index : '' ).filter(String);
        let player2_Positions = board.map((cell, index) => cell === this.player2.symbol ? index: '' ).filter(String);
        if(WINNING_COMBINATIONS.findIndex(
            comb => comb
            .every(
              item => player1_Positions.includes(item)
            )
            ) !== -1){
              this.winner = this.player1.name;
              setTimeout(
                () => {
                  this._isBoardActive.next(false);
                }, 
              1000);
            }
          else if(WINNING_COMBINATIONS.findIndex(
            comb => comb
            .every(
              item => player2_Positions.includes(item)
            )
            ) !== -1){
              this.winner = this.player2.name;
              setTimeout(
                () => {
                  this._isBoardActive.next(false);
                }, 
              1000);
            }
      }
    );
    
  }

  restart() {
    // reset board
    
    this.board$.subscribe(
    () => {
      this.winner = '';
      this.player1 = {} as Player;
      this.player2 = {} as Player;
      this.currentPlayer = {} as Player;
      this.board$ = of(Array(9).fill(''));
    })
  }


  shuffleCurrentPlayer() {
    let randomSymbol = Math.floor(Math.random()*2);
    if(!this.currentPlayer){
      this.currentPlayer = randomSymbol === 0 ? this.player1 : this.player2;
    } else {
      this.currentPlayer = this.currentPlayer.name === this.player1.name ? this.player2 : this.player1;
    }
  }

  onSubmit() {
    if(this.form.valid){
      let randomSymbol = Math.floor(Math.random()*2);
      this.player1 = {
        name: this.form.value.player1,
        symbol: this.symbols[randomSymbol],
        // positions: []
      };
      this.player2 = {
        name: this.form.value.player2,
        symbol: this.symbols[1-randomSymbol],
        // positions: []
      };
      this._isBoardActive.next(true);
      this.shuffleCurrentPlayer();
    }
  }
}

  // if(this.currentPlayer.name === this.player1.name){
  //   this.player1.positions = [...this.player1.positions, index];
  // } else {
  //   this.player2.positions = [...this.player2.positions, index];
  // }
