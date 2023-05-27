import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  baseUri: string = 'http://localhost:4000/user';
  headers = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  constructor(private http: HttpClient) {}
  //Add token to header if exists
  setTokenHeader(): HttpHeaders {
    const token = localStorage.getItem('Token');
    if (token) {
      return this.headers.set('Token', JSON.parse(token!).token);
    } else {
      return this.headers;
    }
  }

  addUser(data: Object): Observable<any> {
    let url = `${this.baseUri}/addUser`;
    return this.http
      .post(url, data, { headers: this.setTokenHeader() })
      .pipe(catchError(this.errorMgmt));
  }

  registerUser(data: Object): Observable<any> {
    let url = `${this.baseUri}/registerUser`;
    return this.http.post(url, data).pipe(catchError(this.errorMgmt));
  }

  loginUser(data: Object): Observable<any> {
    let url = `${this.baseUri}/login`;
    return this.http.post(url, data).pipe((res) => {
      res.subscribe((token) => {
        localStorage.setItem('Token', JSON.stringify(token));
      });
      return res;
    }, catchError(this.errorMgmt));
  }

  getUsers(page: number, size: number): Observable<any> {
    const queryParams = `?page=${page}&size=${size}`;
    return this.http.get(`${this.baseUri}/getUsers` + queryParams, {
      headers: this.setTokenHeader(),
    });
  }

  getUsersTypeAhead(): Observable<any> {
    return this.http.get(`${this.baseUri}/getUsersTypeAhead`, {
      headers: this.setTokenHeader(),
    });
  }

  getUser(id: String): Observable<any> {
    let url = `${this.baseUri}/getUser/${id}`;
    return this.http
      .get<Response>(url, { headers: this.setTokenHeader() })
      .pipe(
        map((res: Response) => {
          return res || {};
        }),
        catchError(this.errorMgmt)
      );
  }

  updateUser(id: String, data: any): Observable<any> {
    let url = `${this.baseUri}/updateUser/${id}`;
    return this.http
      .put(url, data, { headers: this.setTokenHeader() })
      .pipe(catchError(this.errorMgmt));
  }

  deleteUser(id: String): Observable<any> {
    let url = `${this.baseUri}/deleteUser/${id}`;
    return this.http
      .delete(url, { headers: this.setTokenHeader() })
      .pipe(catchError(this.errorMgmt));
  }

  logoutUser(): void {
    if (localStorage.getItem('Token')) {
      let token = JSON.parse(localStorage.getItem('Token')!);
      let url = `${this.baseUri}/logout/`;
      this.http.post(url, { token: token.token });
      localStorage.removeItem('Token');
    }
  }

  errorMgmt(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(error);
  }

  // typeAhead(id: String): Observable<any> {
  //   let url = `${this.baseUri}/updateUser/${id}`;
  //   return this.http
  //     .put(url, data, { headers: this.setTokenHeader() })
  //     .pipe(catchError(this.errorMgmt));
  // }
}
