import { Component, Output, EventEmitter } from '@angular/core';
import { BoardService } from '../board.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.scss']
})
export class PrivacyPolicyComponent {
  @Output() componentSelected = new EventEmitter<string>();  
  constructor(public router: Router, private boardService: BoardService) { }

/**
 * Selects a component based on the provided component name and updates the visibility of components.
 *
 * @param {string} componentName - The name of the component to be selected.
 */
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
  }
}
}
