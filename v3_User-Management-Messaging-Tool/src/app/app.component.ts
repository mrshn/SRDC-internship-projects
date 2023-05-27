import { Component } from '@angular/core';
import { UserService } from './service/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'hw3';
  firstlogin = false;
  isAdmin = false;
  username = '';
  constructor(private userService: UserService) {}

  ngOnInit(): void {
    let token = localStorage.getItem('Token');
    if (token) {
      this.setFirstLogingTrue();
      this.isAdmin = JSON.parse(token).privilege !== -1;
      this.username = JSON.parse(token).username;
    }
  }
  logout() {
    this.setFirstLogingFalse();
    this.userService.logoutUser();
  }
  checkFirstLogin() {
    let token = localStorage.getItem('Token');
    if (token) {
      this.setFirstLogingTrue();
      this.isAdmin = JSON.parse(token).privilege !== -1;
      this.username = JSON.parse(token).username;
      return true;
    } else {
      this.setFirstLogingFalse();
      return false;
    }
  }
  setFirstLogingTrue() {
    this.firstlogin = true;
  }
  setFirstLogingFalse() {
    this.firstlogin = false;
  }
}
