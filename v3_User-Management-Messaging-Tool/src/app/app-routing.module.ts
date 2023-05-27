import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './components/login/login.component';
import { UserOperationComponent } from './components/user-operation/user-operation.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { GetMessagesIOComponent } from './components/get-messages-io/get-messages-io.component';
import { SendMessageComponent } from './components/send-message/send-message.component';
const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: 'register', component: UserOperationComponent },
  { path: 'userOperation/:id', component: UserOperationComponent },
  { path: 'userOperation', component: UserOperationComponent },
  { path: 'sendMessage', component: SendMessageComponent },
  { path: 'listUsers', component: UserListComponent },
  { path: 'getInbox', component: GetMessagesIOComponent },
  { path: 'getOutbox', component: GetMessagesIOComponent },
  { path: 'login', component: LoginComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
