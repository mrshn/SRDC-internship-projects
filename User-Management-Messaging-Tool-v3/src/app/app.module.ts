import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HttpClientModule } from '@angular/common/http';
import { UserService } from './service/user.service';
import { MessageService } from './service/message.service';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './components/login/login.component';
import { UserOperationComponent } from './components/user-operation/user-operation.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { GetMessagesIOComponent } from './components/get-messages-io/get-messages-io.component';
import { SendMessageComponent } from './components/send-message/send-message.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatPaginatorModule } from '@angular/material/paginator';
//import { MaterialModule } from '@angular/material';
//import { BrowserAnimationsModule } from '@angular/platform browser/animations';
//import { PageEvent } from '@angular/material';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    UserOperationComponent,
    UserListComponent,
    GetMessagesIOComponent,
    SendMessageComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgbModule,
    BrowserAnimationsModule,
    //BrowserAnimationsModule,
    //PageEvent,
    MatPaginatorModule,
  ],
  providers: [UserService, MessageService],
  bootstrap: [AppComponent],
})
export class AppModule {}
