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
export class MessageService {
  baseUri: string = 'http://localhost:4000/message';
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

  // Send Message
  sendMessage(data: Object): Observable<any> {
    let url = `${this.baseUri}/sendMessage`;
    return this.http
      .post(url, data, { headers: this.setTokenHeader() })
      .pipe(catchError(this.errorMgmt));
  }

  // Get inbox
  getMessagesInbox(): Observable<any> {
    return this.http.get(`${this.baseUri}/getInbox/`, {
      headers: this.setTokenHeader(),
    });
  }
  // Get outbox
  getMessagesOutbox(): Observable<any> {
    return this.http.get(`${this.baseUri}/getOutbox/`, {
      headers: this.setTokenHeader(),
    });
  }

  // Get Message
  getMessage(id: String): Observable<any> {
    let url = `${this.baseUri}/getMessageId/${id}`;
    return this.http
      .get<Response>(url, { headers: this.setTokenHeader() })
      .pipe(
        map((res: Response) => {
          return res || {};
        }),
        catchError(this.errorMgmt)
      );
  }

  // Delete Message
  deleteMessage(id: String): Observable<any> {
    let url = `${this.baseUri}/deleteMessage/${id}`;
    return this.http
      .delete(url, { headers: this.setTokenHeader() })
      .pipe(catchError(this.errorMgmt));
  }

  // Error handling
  errorMgmt(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(error);
  }
}
