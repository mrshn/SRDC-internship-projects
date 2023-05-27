import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService } from './../../service/message.service';

@Component({
  selector: 'getMessages',
  templateUrl: './get-messages-io.component.html',
  styleUrls: ['./get-messages-io.component.css'],
})
export class GetMessagesIOComponent implements OnInit {
  Messages: any = [];
  isInbox = false;
  isOutbox = false;
  constructor(
    private router: Router,
    private actRoute: ActivatedRoute,
    private messageService: MessageService
  ) {
    console.log('constructor');
  }

  ngOnInit(): void {
    console.log(this.router.url);

    if (this.router.url === '/getInbox') {
      this.isInbox = true;
      console.log('inbox');
      this.getINBOX();
    } else if (this.router.url === '/getOutbox') {
      this.isOutbox = true;
      console.log('outbox');
      this.getOUTBOX();
    }
  }

  getINBOX() {
    this.messageService.getMessagesInbox().subscribe(
      (data) => {
        this.Messages = data;
        this.Messages.forEach((element: any) => {
          element.date = element.date.split('.')[0].replace('T', ' ');
        });
      },
      (error) => {
        console.log(error); //TODO: Handle errors
        switch (error.status) {
          case 500:
            alert('Server error occured try again');
            break;
          default:
            alert('Please login first');
            localStorage.removeItem('Token');
            this.router.navigateByUrl('/login');
        }
      }
    );
  }
  getOUTBOX() {
    this.messageService.getMessagesOutbox().subscribe(
      (data) => {
        this.Messages = data;
        this.Messages.forEach((element: any) => {
          element.date = element.date.split('.')[0].replace('T', ' ');
        });
      },
      (error) => {
        console.log(error); //TODO: Handle errors
        switch (error.status) {
          case 500:
            alert('Server error occured try again');
            break;
          default:
            alert('Please login first');
            localStorage.removeItem('Token');
            this.router.navigateByUrl('/login');
        }
      }
    );
  }

  removeMessage(message: any, index: any) {
    if (window.confirm('Are you sure?')) {
      this.messageService.deleteMessage(message._id).subscribe(
        (data) => {
          this.Messages.splice(index, 1);
          window.location.reload();
        },
        (error) => {
          console.log(error); //TODO: Handle errors
          switch (error.status) {
            case 500:
              alert('Server error occured try again');
              break;
            case 400:
              alert('Message does not exist');
              this.router.navigateByUrl('/login');
              break;
            case 200:
              alert('Message is deleted');
              window.location.reload();
              if (this.isInbox) {
                this.router.navigateByUrl('/getInbox');
              } else {
                this.router.navigateByUrl('/getOutbox');
              }
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
