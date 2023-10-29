import { Component, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { BoardService } from '../board.service';

@Component({
  selector: 'app-introduction',
  templateUrl: './introduction.component.html',
  styleUrls: ['./introduction.component.scss']
})
export class IntroductionComponent {
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
          this.boardService.showInfo = false;
          break;
    }
  }
}
