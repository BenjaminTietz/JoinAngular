import { Component, OnInit } from '@angular/core';
import { RemotestorageService } from '../remotestorage.service';
import { TaskArraysService } from '../task-arrays.service';
import { BoardService } from '../board.service';
import { LoginService } from '../login.service';
import {Title} from "@angular/platform-browser";

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
    public loginService: LoginService,
    private titleService:Title
  ) {this.titleService.setTitle("Join - Summary");}

/**
 * Initializes the component and performs necessary actions when it's created.
 */
async ngOnInit(): Promise<void> {
  await this.TaskArrayService.loadTasks();
  await this.TaskArrayService.findNearestDate(this.TaskArrayService.tasks);
  this.loginService.loadUser();
}

/**
 * Selects a component based on the provided component name and updates the visibility of components.
 *
 * @param {string} componentName - The name of the component to select.
 */
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
