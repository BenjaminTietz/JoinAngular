import { Component, OnInit } from '@angular/core';
import { BoardService } from './board.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  template: `
  <app-app-sidebar-desktop
    [showSummary]="showSummary"
    [showAddTask]="showAddTask"
    [showBoard]="showBoard"
    [showContacts]="showContacts"
  ></app-app-sidebar-desktop>
  <app-summary (valueChanged)="onValueChanged($event)"></app-summary>
`
})
export class AppComponent {
  titel = "Join";
  showSummary: boolean = true;
  showAddTask: boolean = false;
  showBoard: boolean = false;
  showContacts: boolean = false;

  constructor(private boardService: BoardService) {}

  onValueChanged(value: boolean) {
    this.boardService.showSummary = value;
    this.boardService.showAddTask = value;
    this.boardService.showBoard = value;
    this.boardService.showContacts = value;
  }

  ngOnInit() {
    this.showSummary = this.boardService.showSummary;
    this.showAddTask = this.boardService.showAddTask;
    this.showBoard = this.boardService.showBoard;
    this.showContacts = this.boardService.showContacts;
  }
}
