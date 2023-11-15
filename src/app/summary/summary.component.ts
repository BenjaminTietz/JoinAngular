import { Component, Output, EventEmitter, Input, OnInit } from '@angular/core';
import { BoardService } from '../board.service';
import { RemotestorageService } from '../remotestorage.service';
import { TaskArraysService } from '../task-arrays.service';
import { ArraysService } from '../contact-arrays.service';
import { LoginService } from '../login.service';
import {Title} from "@angular/platform-browser";

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss'],

})
export class SummaryComponent {
  constructor(public boardService: BoardService,
    public RemotestorageService: RemotestorageService,
    public ArraysService: ArraysService,
    public TaskArraysService: TaskArraysService,
    public loginService: LoginService,
    private titleService:Title
    ) {this.titleService.setTitle("Join - Summary");}


/**
 * Indicates whether the "Summary" component should be shown.
 */
@Input() showSummary: boolean;

/**
 * Indicates whether the "Add Task" component should be shown.
 */
@Input() showAddTask: boolean;

/**
 * Indicates whether the "Board" component should be shown.
 */
@Input() showBoard: boolean;

/**
 * Indicates whether the "Contacts" component should be shown.
 */
@Input() showContacts: boolean;

/**
 * Indicates whether the "Privacy Policy" component should be shown.
 */
@Input() showPrivacyPolicy: boolean;

/**
 * Indicates whether the "Legal Notice" component should be shown.
 */
@Input() showLegalNotice: boolean;

/**
 * Indicates whether the "Info" component should be shown.
 */
@Input() showInfo: boolean;

/**
 * Initializes the component by loading user data, tasks, and performing other necessary operations.
 */
async ngOnInit() {
    await this.loginService.loadUser();
    await this.TaskArraysService.loadTasks();
    await this.ArraysService.loadContacts();
    await this.TaskArraysService.mapTaskStatus();
    await this.TaskArraysService.mapUrgentTasks();
    this.loginService.getGreeting();
    this.TaskArraysService.findNearestDate(this.TaskArraysService.tasks);
    await this.TaskArraysService.loadTasks();
}

}