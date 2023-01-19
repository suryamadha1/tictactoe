import { fromEvent, scan, from, mergeMap, map, of, tap, EMPTY, combineLatest, Observable, switchMap, forkJoin } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PracticeService } from 'src/app/services/practice.service';

@Component({
  selector: 'app-practice',
  templateUrl: './practice.component.html',
  styleUrls: ['./practice.component.css']
})
export class PracticeComponent implements OnInit {

  data = [
    {
      id: 1,
      name: "first"
    },
    {
      id: 2,
      name: "second"
    }
  ]

  constructor(private http: HttpClient, private practice: PracticeService) { }


  data$ = of(this.data);
  userData$: Observable<user[]>;



  ngOnInit() {
    this.userData$ = this.data$.pipe(
      map(users => users.map(user => this.getTodosForUser(user))),
      switchMap(userWithTodo$ =>  forkJoin(userWithTodo$))
    );


  }
  private getTodosForUser(user: inituser): Observable<user> {
    return this.practice.getTodos(user.id).pipe(
      map(todos => ({...user, todos}))
    )
  }
  myFunction() {
    this.userData$
    .subscribe(
      results => console.log(results)
    )

    // combineLatest([
    //   this.data$,
    //   // this.practice.getTodos
    // ])
    //   .pipe(
    //     map(([data]) => ({
    //       ...data,
    //       results: data
    //     }))
    //   )
    //   .subscribe(
    //     result => console.log(result)
    //   )


    let userData: user[] = []


    // old method
    this.data$
    .pipe(
      map(data => from(data)),

      mergeMap(
        data => data.pipe(
          map(item => this.getTodosForUser(item)),
          map(user => user)
        )
      )
    )
    .subscribe(
      // result => result.subscribe(
        data => console.log('user',data)
      // )
    )

    // new method



  }
}

export interface inituser {
  id: number;
  name: string;
}

export interface user {
  id: number;
  name: string;
  todos: todos;
};

export interface todos {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

// {
          // this.practice.getTodos(item.id)
          //   .subscribe(
          //     todoResults => {
          //       userData.push(
          //         {
          //           ...item,
          //           todos: todoResults
          //         }
          //       )
          //     }
          //   )
          // }