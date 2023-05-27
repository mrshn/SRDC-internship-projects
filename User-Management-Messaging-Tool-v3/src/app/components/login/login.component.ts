import { Component, OnInit, NgZone } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from './../../service/user.service';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  invalidLogin = false;
  onSubmitBoolean = false;

  constructor(
    public fb: FormBuilder,
    private router: Router,
    private ngZone: NgZone,
    private userService: UserService
  ) {
    this.generateLoginForm();
  }

  ngOnInit(): void {
    if (localStorage.getItem('Token')) {
      this.ngZone.run(() => this.router.navigateByUrl('/getInbox')); //TODO: CHANGE
    }
  }

  generateLoginForm() {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  get myForm() {
    return this.loginForm.controls;
  }

  onSubmit() {
    this.onSubmitBoolean = true;
    this.invalidLogin = false;
    if (!this.loginForm.valid) {
      return;
    } else {
      this.userService.loginUser(this.loginForm.value).subscribe(
        () => {
          this.ngZone.run(() => this.router.navigateByUrl('/getInbox'));
        },
        (error) => {
          if (error.error === 'Invalid username or password') {
            this.invalidLogin = true;
          }
          //this.ngZone.run(() => this.router.navigateByUrl('/login'));
        }
      );
    }
  }
}
