import { Component, OnInit } from '@angular/core';
import { RemotestorageService } from '../remotestorage.service';
import { TaskArraysService } from '../task-arrays.service';
import { BoardService } from '../board.service';
@Component({
  selector: 'app-summary-dashboard',
  templateUrl: './summary-dashboard.component.html',
  styleUrls: ['./summary-dashboard.component.scss']
})
export class SummaryDashboardComponent {


  constructor(
    public TaskArrayService: TaskArraysService,
    public RemoteStorageService: RemotestorageService,
    public boardService: BoardService
  ) {}

  ngOnInit(): void {
    
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
