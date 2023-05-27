import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from './../../service/user.service';

import { Observable, OperatorFunction } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { PageEvent } from '@angular/material/paginator';
declare var $: any;
@Component({
  selector: 'listUsers',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
})
export class UserListComponent implements OnInit {
  Users: any = [];

  usernames: any = new Array();
  public model: any;
  totalposts = 10;
  postperpage = 6;
  pageSizeOption = [1, 2, 5, 10];
  currentpage = 1;
  myArray = this.Users;
  constructor(private router: Router, private userService: UserService) {}
  ngOnInit() {
    this.getDataFromService();
  }

  onChangedPage(pageData: PageEvent) {
    console.log(pageData);
    this.currentpage = pageData.pageIndex + 1;
    this.postperpage = pageData.pageSize;
    this.getDataFromService();
  }

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

  getDataFromService() {
    this.userService.getUsers(this.currentpage, this.postperpage).subscribe(
      (data) => {
        this.Users = data;
        this.Users.forEach((element: any) => {
          element.birthdate = element.birthdate.split('T')[0];
          this.usernames.push(element.username);
        });
        this.myArray = this.Users;
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
            alert('Please login first');
            localStorage.removeItem('Token');
            this.router.navigateByUrl('/login');
        }
      },
      () => {} //TODO: check this later  The message port closed before a response was received. error??
    );
  }

  removeUser(id: any) {
    if (window.confirm('Are you sure?')) {
      this.userService.deleteUser(id).subscribe(
        (data) => {
          window.location.reload();
        },
        (error) => {
          console.log(error); //TODO: Handle errors
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
  }
  sortClick(column: any, order: any, text: any) {
    console.log('colum was cilickeeed');

    //text = text.substring(0, text.length - 1);

    if (order == 'desc') {
      $(this).data('order', 'asc');
      this.myArray = this.myArray.sort((a: any, b: any) =>
        a[column] > b[column] ? 1 : -1
      );
      console.log(this.myArray);
      text += '&#9660';
      console.log(text);
    } else {
      $(this).data('order', 'desc');
      this.myArray = this.myArray.sort((a: any, b: any) =>
        a[column] < b[column] ? 1 : -1
      );
      text += '&#9650';
    }
    $(this).html(text);
    this.buildTable();
  }
  buildTable() {
    var data = this.myArray;
    var table: any = document.getElementById('myTable');
    table.innerHTML = '';
    for (var i = 0; i < data.length; i++) {
      var row = `<tr>
  							<th scope="row">${data[i].username}</th>
        <td>${data[i].name}</td>
        <td>${data[i].surname}</td>
        <td>${data[i].gender}</td>
        <td>${data[i].email}</td>
        <td>${data[i].birthdate}</td>
        <td >${data[i].privilege}</td>
        <td class="text-center edit-block">
          <span class="edit" [routerLink]="['/userOperation/', user._id]">
            <button type="button" class="btn btn-success btn-sm">Edit</button>
          </span>
          <span class="delete" (click)="removeUser(user._id)">
            <button type="button" class="btn btn-danger btn-sm">Delete</button>
          </span>
        </td>
  					  </tr>`;

      table.innerHTML += row;
    }
  }
}
