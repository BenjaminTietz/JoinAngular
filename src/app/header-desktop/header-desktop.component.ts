import { Component, Output, EventEmitter, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { BoardService } from '../board.service';
@Component({
  selector: 'app-header-desktop',
  templateUrl: './header-desktop.component.html',
  styleUrls: ['./header-desktop.component.scss']
})
export class HeaderDesktopComponent {
  @Output() componentSelected = new EventEmitter<string>();  
  constructor(public router: Router, private boardService: BoardService) { }
  @ViewChild('dropdown') dropdown: ElementRef;
  
  showDropdown() {
    this.dropdown.nativeElement.classList.toggle('show');
  }

  selectComponent(componentName: string) {
    switch (componentName) {
      case 'app-introduction':
        this.boardService.showSummary = false;
        this.boardService.showAddTask = false;
        this.boardService.showBoard = false;
        this.boardService.showContacts = false;
        this.boardService.showPrivacyPolicy = false;
        this.boardService.showLegalNotice = false;
        this.boardService.showInfo = true;
        break;
        case 'app-summary':
          this.boardService.showSummary = true;
          this.boardService.showAddTask = false;
          this.boardService.showBoard = false;
          this.boardService.showContacts = false;
          this.boardService.showPrivacyPolicy = false;
          this.boardService.showLegalNotice = false;
          this.boardService.showInfo = false;
          break;
          case 'app-privacy-policy':
            this.boardService.showSummary = false;
            this.boardService.showAddTask = false;
            this.boardService.showBoard = false;
            this.boardService.showContacts = false;
            this.boardService.showPrivacyPolicy = true;
            this.boardService.showLegalNotice = false;
            this.boardService.showInfo = false;
            break;
            case 'app-legal-notice':
              this.boardService.showSummary = false;
              this.boardService.showAddTask = false;
              this.boardService.showBoard = false;
              this.boardService.showContacts = false;
              this.boardService.showPrivacyPolicy = false;
              this.boardService.showLegalNotice = true;
              this.boardService.showInfo = false;
              break;
    }
  }
}

