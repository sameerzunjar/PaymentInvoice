import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoginService {

  constructor(private http: HttpClient) { }

  loginUser(userName: string, password: string) {
    const body = {
      username: userName,
      password: password,
    };
    const data = {
      loginStatus: true,
      username: 'test'
    }
    return of(data);
  }
}