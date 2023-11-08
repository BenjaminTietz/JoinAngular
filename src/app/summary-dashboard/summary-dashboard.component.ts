import { Component, OnInit } from '@angular/core';
import { RemotestorageService } from '../remotestorage.service';
import { TaskArraysService } from '../task-arrays.service';
import { BoardService } from '../board.service';
import { LoginService } from '../login.service';
@Component({
  selector: 'app-summary-dashboard',
  templateUrl: './summary-dashboard.component.html',
  styleUrls: ['./summary-dashboard.component.scss']
})
export class SummaryDashboardComponent {


  constructor(
    public TaskArrayService: TaskArraysService,
    public RemoteStorageService: RemotestorageService,
    public boardService: BoardService,
    public loginService: LoginService
  ) {}

  ngOnInit(): void {
    this.TaskArrayService.findNearestDate(this.TaskArrayService.urgent);
    this.loginService.loadUser();
    
  }

  selectComponent(componentName: string) {
    switch (componentName) {
          case 'app-board':
          this.boardService.showSummary = false;
          this.boardService.showAddTask = false;
          this.boardService.showBoard = true;
          this.boardService.showContacts = false;
          this.boardService.showPrivacyPolicy = false;
          this.boardService.showLegalNotice = false;
          break;
    }
  }

}
