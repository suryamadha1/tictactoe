import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PracticeService {

  constructor(private http: HttpClient) { }

  getTodos(id: number): Observable<any> {
    return this.http
    .get(`https://jsonplaceholder.typicode.com/todos/${id}`)
    .pipe(catchError(err =>  {
      throw(err)
    }))
  }
}
