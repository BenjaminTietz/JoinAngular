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
    [showPrivacyPolicy]="showPrivacyPolicy"
    [showLegalNotice]="showLegalNotice"
    [showInfo]="showInfo"
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
  showPrivacyPolicy: boolean = false;
  showLegalNotice: boolean = false;
  showInfo: boolean = false;

  constructor(private boardService: BoardService) {}

  onValueChanged(value: boolean) {
    this.boardService.showSummary = value;
    this.boardService.showAddTask = value;
    this.boardService.showBoard = value;
    this.boardService.showContacts = value;
    this.boardService.showPrivacyPolicy = value;
    this.boardService.showLegalNotice = value;
    this.boardService.showInfo = value;
  }

  ngOnInit() {
    this.showSummary = this.boardService.showSummary;
    this.showAddTask = this.boardService.showAddTask;
    this.showBoard = this.boardService.showBoard;
    this.showContacts = this.boardService.showContacts;
    this.showPrivacyPolicy = this.boardService.showPrivacyPolicy;
    this.showLegalNotice = this.boardService.showLegalNotice;
    this.showInfo = this.boardService.showInfo;
  }
}
