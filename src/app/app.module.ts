import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { RouterModule, Router } from '@angular/router';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { SummaryComponent } from './summary/summary.component';
import { HeaderDesktopComponent } from './header-desktop/header-desktop.component';
import { SidebarDesktopComponent } from './sidebar-desktop/sidebar-desktop.component';
import { SummaryDashboardComponent } from './summary-dashboard/summary-dashboard.component';
import { AddtaskComponent } from './addtask/addtask.component';
import { BoardComponent } from './board/board.component';
import { ContactsComponent } from './contacts/contacts.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    SummaryComponent,
    HeaderDesktopComponent,
    SidebarDesktopComponent,
    SummaryDashboardComponent,
    AddtaskComponent,
    BoardComponent,
    ContactsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
