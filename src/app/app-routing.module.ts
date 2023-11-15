import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component'; 
import { SignupComponent } from './signup/signup.component';
import { SummaryComponent } from './summary/summary.component';
import { AddtaskComponent } from './addtask/addtask.component';
import { BoardComponent } from './board/board.component';
import { ContactsComponent } from './contacts/contacts.component';
import { SummaryDashboardComponent } from './summary-dashboard/summary-dashboard.component';

/**
 * Defines the routes for the Angular application.
 * Each route maps a URL path to a corresponding component.
 */
let routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'join', component: SummaryComponent },
  { path: 'summarydashboard', component: SummaryDashboardComponent },
  { path: 'addtask', component: AddtaskComponent },
  { path: 'board', component: BoardComponent },
  { path: 'contacts', component: ContactsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
