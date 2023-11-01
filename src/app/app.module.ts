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
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { LegalNoticeComponent } from './legal-notice/legal-notice.component';
import { IntroductionComponent } from './introduction/introduction.component';
import { FormsModule }   from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { DragAndDropService } from './drag-and-drop.service';
import { RemotestorageService } from './remotestorage.service';
import { TaskArraysService } from './task-arrays.service';


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
    ContactsComponent,
    PrivacyPolicyComponent,
    LegalNoticeComponent,
    IntroductionComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [DragAndDropService, RemotestorageService, TaskArraysService],
  bootstrap: [AppComponent]
})
export class AppModule { }
