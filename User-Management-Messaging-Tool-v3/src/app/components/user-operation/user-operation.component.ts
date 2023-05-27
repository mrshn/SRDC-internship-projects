import { User } from '../../model/user';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from './../../service/user.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'userOperation',
  templateUrl: './user-operation.component.html',
  styleUrls: ['./user-operation.component.css'],
})
export class UserOperationComponent implements OnInit {
  submitted = false;
  update = false;
  register = false;
  maxdate = new Date().toISOString().split('T')[0];
  editForm!: FormGroup;
  loginForm!: FormGroup;
  userData!: User[];
  userGender: any = ['Male', 'Female'];
  userType: any = ['Admin', 'User'];

  constructor(
    public fb: FormBuilder,
    private actRoute: ActivatedRoute,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit() {
    if (this.router.url !== '/register') {
      if (!localStorage.getItem('Token')) {
        alert('Please login first');
        this.router.navigateByUrl('/login');
      }
    } else {
      this.register = true;
    }
    let id = this.actRoute.snapshot.paramMap.get('id');
    if (id) {
      this.updateUser();
      this.update = true;
      this.getUser(id);
    } else {
      if (this.register) {
        this.createUserReg();
      } else {
        this.createUser();
      }
    }
  }

  get myForm() {
    return this.editForm.controls;
  }
  //TODO:
  getUser(id: String) {
    this.userService.getUser(id).subscribe(
      (data) => {
        this.editForm.setValue({
          username: data['username'],
          name: data['name'],
          surname: data['surname'],
          gender: data['gender'],
          email: data['email'],
          birthdate: data['birthdate'].split('T')[0],
          privilege: data['privilege'],
        });
      },
      (error) => {
        console.log(error);
        switch (error.status) {
          case 500:
            alert('Server error occured try again');
            break;
          case 400:
            alert('User does not exist');
            this.router.navigateByUrl('/listUsers');
            break;
          default:
            alert('Please login first');
            localStorage.removeItem('Token');
            this.router.navigateByUrl('/login');
        }
      }
    );
  }
  createUser() {
    this.editForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
      name: ['', [Validators.required]],
      surname: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      email: [
        '',
        [
          Validators.required,
          Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,3}$'),
        ],
      ],
      birthdate: ['', [Validators.required]],
      privilege: ['', [Validators.required]],
    });
  }
  createUserReg() {
    this.editForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
      name: ['', [Validators.required]],
      surname: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      email: [
        '',
        [
          Validators.required,
          Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,3}$'),
        ],
      ],
      birthdate: ['', [Validators.required]],
      privilege: '-1',
    });
  }

  updateUser() {
    this.editForm = this.fb.group({
      username: ['', [Validators.required]],
      name: ['', [Validators.required]],
      surname: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      email: [
        '',
        [
          Validators.required,
          Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,3}$'),
        ],
      ],
      birthdate: ['', [Validators.required]],
      privilege: ['', [Validators.required]],
    });
  }
  generateLoginForm() {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  onSubmit() {
    this.submitted = true;
    if (!this.editForm.valid) {
      return;
    } else {
      if (window.confirm('Are you sure?')) {
        if (this.update) {
          let id = this.actRoute.snapshot.paramMap.get('id');
          this.userService.updateUser(id!, this.editForm.value).subscribe(
            () => {
              this.router.navigateByUrl('/listUsers');
            },
            (error) => {
              console.log(error);
              switch (error.status) {
                case 500:
                  alert('Server error occured try again');
                  break;
                case 400:
                  alert('User does not exist');
                  this.router.navigateByUrl('/listUsers');
                  break;
                default:
                  alert('Please login first');
                  localStorage.removeItem('Token');
                  this.router.navigateByUrl('/login');
              }
            }
          );
        } else if (this.register) {
          this.register = false;
          this.generateLoginForm();
          this.userService.registerUser(this.editForm.value).subscribe(
            () => {
              this.loginForm.value.username = this.editForm.value.username;
              this.loginForm.value.password = this.editForm.value.password;
              this.userService.loginUser(this.loginForm.value).subscribe(
                () => {
                  this.router.navigateByUrl('/getInbox');
                },
                (error) => {
                  //this.ngZone.run(() => this.router.navigateByUrl('/login'));
                }
              );
            },
            (error) => {
              console.log(error);
              switch (error.status) {
                case 500:
                  alert('Server error occured try again');
                  break;
                case 400:
                  alert('User does not exist');
                  this.router.navigateByUrl('/listUsers');
                  break;
                default:
                  alert('Please login first');
                  localStorage.removeItem('Token');
                  this.router.navigateByUrl('/login');
              }
            }
          );
        } else {
          this.userService.addUser(this.editForm.value).subscribe(
            () => {
              this.router.navigateByUrl('/listUsers');
            },
            (error) => {
              console.log(error);
              switch (error.status) {
                case 500:
                  alert('Server error occured try again');
                  break;
                case 400:
                  alert('User already exists');
                  break;
                default:
                  alert('Please login first');
                  localStorage.removeItem('Token');
                  this.router.navigateByUrl('/login');
              }
            }
          );
        }
      }
    }
  }
}
