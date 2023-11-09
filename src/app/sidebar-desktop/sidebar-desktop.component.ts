import { Component, Output, EventEmitter, ViewChild, ElementRef  } from '@angular/core';
import { Router } from '@angular/router';
import { BoardService } from '../board.service';
import { TaskArraysService } from '../task-arrays.service';

@Component({
  selector: 'app-sidebar-desktop',
  templateUrl: './sidebar-desktop.component.html',
  styleUrls: ['./sidebar-desktop.component.scss']
})
export class SidebarDesktopComponent {
  @ViewChild('summary') summary: ElementRef;
  @ViewChild('addTask') addTask: ElementRef;
  @ViewChild('board') board: ElementRef;
  @ViewChild('contacts') contacts: ElementRef;
  @ViewChild('privacy') privacy: ElementRef;
  @ViewChild('legal') legal: ElementRef;

  @Output() componentSelected = new EventEmitter<string>();  
  constructor(public router: Router, private boardService: BoardService, public TaskArraysService: TaskArraysService) { }

  selectComponent(componentName: string) {
    switch (componentName) {
      case 'app-summary-dashboard':
       
        this.summary.nativeElement.classList.add('sidebar-row-active');
        this.addTask.nativeElement.classList.remove('sidebar-row-active');
        this.board.nativeElement.classList.remove('sidebar-row-active');
        this.contacts.nativeElement.classList.remove('sidebar-row-active');

        this.privacy.nativeElement.classList.remove('sidebar-bottom-btn-container-active');
        this.legal.nativeElement.classList.remove('sidebar-bottom-btn-container-active');


        this.boardService.showSummary = true;
        this.boardService.showAddTask = false;
        this.boardService.showBoard = false;
        this.boardService.showContacts = false;
        this.boardService.showPrivacyPolicy = false;
        this.boardService.showLegalNotice = false;
        break;
        case 'app-addtask':

          this.summary.nativeElement.classList.remove('sidebar-row-active');
          this.addTask.nativeElement.classList.add('sidebar-row-active');
          this.board.nativeElement.classList.remove('sidebar-row-active');
          this.contacts.nativeElement.classList.remove('sidebar-row-active');

          this.privacy.nativeElement.classList.remove('sidebar-bottom-btn-container-active');
          this.legal.nativeElement.classList.remove('sidebar-bottom-btn-container-active');

          this.boardService.showSummary = false;
          this.boardService.showAddTask = true;
          this.boardService.showBoard = false;
          this.boardService.showContacts = false;
          this.boardService.showPrivacyPolicy = false;
          this.boardService.showLegalNotice = false;
          break;
          case 'app-board':

            this.summary.nativeElement.classList.remove('sidebar-row-active');
            this.addTask.nativeElement.classList.remove('sidebar-row-active');
            this.board.nativeElement.classList.add('sidebar-row-active');
            this.contacts.nativeElement.classList.remove('sidebar-row-active');

            this.privacy.nativeElement.classList.remove('sidebar-bottom-btn-container-active');
            this.legal.nativeElement.classList.remove('sidebar-bottom-btn-container-active');

          this.boardService.showSummary = false;
          this.boardService.showAddTask = false;
          this.boardService.showBoard = true;
          this.boardService.showContacts = false;
          this.boardService.showPrivacyPolicy = false;
          this.boardService.showLegalNotice = false;
          break;
          case 'app-contacts':

            this.summary.nativeElement.classList.remove('sidebar-row-active');
            this.addTask.nativeElement.classList.remove('sidebar-row-active');
            this.board.nativeElement.classList.remove('sidebar-row-active');
            this.contacts.nativeElement.classList.add('sidebar-row-active');

            this.privacy.nativeElement.classList.remove('sidebar-bottom-btn-container-active');
            this.legal.nativeElement.classList.remove('sidebar-bottom-btn-container-active');

          this.boardService.showSummary = false;
          this.boardService.showAddTask = false;
          this.boardService.showBoard = false;
          this.boardService.showContacts = true;
          this.boardService.showPrivacyPolicy = false;
          this.boardService.showLegalNotice = false;
          break;
          case 'app-privacy-policy':

            this.privacy.nativeElement.classList.add('sidebar-bottom-btn-container-active');
            this.legal.nativeElement.classList.remove('sidebar-bottom-btn-container-active');

            this.summary.nativeElement.classList.remove('sidebar-row-active');
            this.addTask.nativeElement.classList.remove('sidebar-row-active');
            this.board.nativeElement.classList.remove('sidebar-row-active');
            this.contacts.nativeElement.classList.remove('sidebar-row-active');
    
            this.boardService.showSummary = false;
            this.boardService.showAddTask = false;
            this.boardService.showBoard = false;
            this.boardService.showContacts = false;
            this.boardService.showPrivacyPolicy = true;
            this.boardService.showLegalNotice = false;
          break;
          case 'app-legal-notice':

            this.privacy.nativeElement.classList.remove('sidebar-bottom-btn-container-active');
            this.legal.nativeElement.classList.add('sidebar-bottom-btn-container-active');

            this.summary.nativeElement.classList.remove('sidebar-row-active');
            this.addTask.nativeElement.classList.remove('sidebar-row-active');
            this.board.nativeElement.classList.remove('sidebar-row-active');
            this.contacts.nativeElement.classList.remove('sidebar-row-active');
    
            this.boardService.showSummary = false;
            this.boardService.showAddTask = false;
            this.boardService.showBoard = false;
            this.boardService.showContacts = false;
            this.boardService.showPrivacyPolicy = false;
            this.boardService.showLegalNotice = true;
          break;
    }
  }

}
