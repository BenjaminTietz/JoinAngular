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
        console.log('Selected component:', componentName);
        this.boardService.showSummary = true;
        console.log(this.boardService.showSummary);
        this.boardService.showAddTask = false;
        this.boardService.showBoard = false;
        this.boardService.showContacts = false;
        break;
        case 'app-addtask':
          console.log('Selected component:', componentName);
          this.boardService.showSummary = false;
          this.boardService.showAddTask = true;
          this.boardService.showBoard = false;
          this.boardService.showContacts = false;
          break;
          case 'app-board':
          console.log('Selected component:', componentName);
          this.boardService.showSummary = false;
          this.boardService.showAddTask = false;
          this.boardService.showBoard = true;
          this.boardService.showContacts = false;
          break;
          case 'app-contacts':
          console.log('Selected component:', componentName);
          this.boardService.showSummary = false;
          this.boardService.showAddTask = false;
          this.boardService.showBoard = false;
          this.boardService.showContacts = true;
          break;
    }
  }
}
