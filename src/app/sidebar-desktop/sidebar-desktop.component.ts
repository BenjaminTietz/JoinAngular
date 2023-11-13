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

/**
 * Selects the specified component and updates the sidebar and component visibility.
 *
 * @param {string} componentName - The name of the component to select.
 */
selectComponent(componentName: string) {
  /**
   * Resets the state of the sidebar elements and component visibility.
   */
  let resetSidebarState = () => {
    let elements = [
      this.summary,
      this.addTask,
      this.board,
      this.contacts,
      this.privacy,
      this.legal,
    ];

    for (let element of elements) {
      if (element) {
        element.nativeElement.classList.remove('sidebar-row-active');
        element.nativeElement.classList.remove('sidebar-bottom-btn-container-active');
      }
    }

    this.boardService.showSummary = false;
    this.boardService.showAddTask = false;
    this.boardService.showBoard = false;
    this.boardService.showContacts = false;
    this.boardService.showPrivacyPolicy = false;
    this.boardService.showLegalNotice = false;
  };

  resetSidebarState();

  switch (componentName) {
    case 'app-summary-dashboard':
      this.summary.nativeElement.classList.add('sidebar-row-active');
      this.boardService.showSummary = true;
      break;
    case 'app-addtask':
      this.addTask.nativeElement.classList.add('sidebar-row-active');
      this.boardService.showAddTask = true;
      break;
    case 'app-board':
      this.board.nativeElement.classList.add('sidebar-row-active');
      this.boardService.showBoard = true;
      break;
    case 'app-contacts':
      this.contacts.nativeElement.classList.add('sidebar-row-active');
      this.boardService.showContacts = true;
      break;
    case 'app-privacy-policy':
      this.privacy.nativeElement.classList.add('sidebar-bottom-btn-container-active');
      this.boardService.showPrivacyPolicy = true;
      break;
    case 'app-legal-notice':
      this.legal.nativeElement.classList.add('sidebar-bottom-btn-container-active');
      this.boardService.showLegalNotice = true;
      break;
    default:
      break;
  }
} 
  
}
