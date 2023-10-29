import { Component, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { BoardService } from '../board.service';

@Component({
  selector: 'app-sidebar-desktop',
  templateUrl: './sidebar-desktop.component.html',
  styleUrls: ['./sidebar-desktop.component.scss']
})
export class SidebarDesktopComponent {
  @Output() componentSelected = new EventEmitter<string>();  
  constructor(public router: Router, private boardService: BoardService) { }

  selectComponent(componentName: string) {
    switch (componentName) {
      case 'app-summary-dashboard':
        this.boardService.showSummary = true;
        this.boardService.showAddTask = false;
        this.boardService.showBoard = false;
        this.boardService.showContacts = false;
        this.boardService.showPrivacyPolicy = false;
        this.boardService.showLegalNotice = false;
        break;
        case 'app-addtask':
          this.boardService.showSummary = false;
          this.boardService.showAddTask = true;
          this.boardService.showBoard = false;
          this.boardService.showContacts = false;
          this.boardService.showPrivacyPolicy = false;
          this.boardService.showLegalNotice = false;
          break;
          case 'app-board':
          this.boardService.showSummary = false;
          this.boardService.showAddTask = false;
          this.boardService.showBoard = true;
          this.boardService.showContacts = false;
          this.boardService.showPrivacyPolicy = false;
          this.boardService.showLegalNotice = false;
          break;
          case 'app-contacts':
          this.boardService.showSummary = false;
          this.boardService.showAddTask = false;
          this.boardService.showBoard = false;
          this.boardService.showContacts = true;
          this.boardService.showPrivacyPolicy = false;
          this.boardService.showLegalNotice = false;
          break;
          case 'app-privacy-policy':
            console.log('Selected component:', componentName);
            this.boardService.showSummary = false;
            this.boardService.showAddTask = false;
            this.boardService.showBoard = false;
            this.boardService.showContacts = false;
            this.boardService.showPrivacyPolicy = true;
            this.boardService.showLegalNotice = false;
          break;
          case 'app-legal-notice':
            console.log('Selected component:', componentName);
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
