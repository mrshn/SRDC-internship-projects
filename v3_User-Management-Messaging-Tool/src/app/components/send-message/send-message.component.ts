import { User } from '../../model/user';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from './../../service/message.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from './../../service/user.service';
import { Observable, OperatorFunction } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';

@Component({
  selector: 'sendMessage',
  templateUrl: './send-message.component.html',
  styleUrls: ['./send-message.component.css'],
})
export class SendMessageComponent implements OnInit {
  Users: any = [];
  usernames: any = new Array();
  public model: any;
  submitted = false;
  send = false;
  messageForm!: FormGroup;

  constructor(
    public fb: FormBuilder,
    private actRoute: ActivatedRoute,
    private messageService: MessageService,
    private userService: UserService,
    private router: Router
  ) {}

  search: OperatorFunction<string, readonly string[]> = (
    text$: Observable<string>
  ) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map((term) =>
        term.length < 2
          ? []
          : this.usernames
              .filter(
                (v: any) => v!.toLowerCase().indexOf(term.toLowerCase()) > -1
              )
              .slice(0, 10)
      )
    );

  ngOnInit() {
    this.getDataFromService();
    if (!localStorage.getItem('Token')) {
      alert('Please login first');
      this.router.navigateByUrl('/login');
    }
    this.createForm();
  }
  //TODO: CHECK
  getDataFromService() {
    this.userService.getUsersTypeAhead().subscribe(
      (data) => {
        this.Users = data;
        this.Users.forEach((element: any) => {
          element.birthdate = element.birthdate.split('T')[0];
          this.usernames.push(element.username);
        });

        console.log(this.Users);
        //this.usernames = data.element.username;
        console.log(this.usernames);
      },
      (error) => {
        switch (error.status) {
          case 500:
            alert('Server error occured try again');
            break;
          default:
            console.log(error);
          // alert('Please login first');
          // localStorage.removeItem('Token');
          // this.router.navigateByUrl('/login');
        }
      },
      () => {} //TODO: check this later  The message port closed before a response was received. error??
    );
  }

  get myForm() {
    return this.messageForm.controls;
  }

  createForm() {
    this.messageForm = this.fb.group({
      reciever: ['', [Validators.required]],
      title: ['', [Validators.required]],
      message: ['', [Validators.required]],
    });
  }

  onSubmit() {
    this.submitted = true;
    if (!this.messageForm.valid) {
      return;
    } else {
      if (window.confirm('Are you sure?')) {
        this.messageService.sendMessage(this.messageForm.value).subscribe(
          (res) => {
            if (res.response === 'User does not exist') {
              alert('User does not exist!');
            } else if (res.response === 'Message is sent') {
              this.send = true;
            }
          },
          (error) => {
            console.log(error);
            switch (error.status) {
              case 500:
                alert('Server error occured try again');
                break;
              default:
              //alert('Please login first');
              //localStorage.removeItem('Token');
              //this.router.navigateByUrl('/login');
            }
          }
        );
      }
    }
  }
}
