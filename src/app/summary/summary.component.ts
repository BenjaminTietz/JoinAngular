import { Component, Output, EventEmitter, Input, OnInit } from '@angular/core';
import { BoardService } from '../board.service';
import { RemotestorageService } from '../remotestorage.service';
import { TaskArraysService } from '../task-arrays.service';
import { ArraysService } from '../contact-arrays.service';


@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss'],

})
export class SummaryComponent {
  constructor(public boardService: BoardService,
    public RemotestorageService: RemotestorageService,
    public ArraysService: ArraysService,
    public TaskArraysService: TaskArraysService
    ) {}

  @Input() showSummary: boolean;
  @Input() showAddTask: boolean;
  @Input() showBoard: boolean;
  @Input() showContacts: boolean;
  @Input() showPrivacyPolicy: boolean;
  @Input() showLegalNotice: boolean;
  @Input() showInfo: boolean;  

  async ngOnInit() {
    await this.TaskArraysService.loadTasks();
    await this.ArraysService.loadContacts();
    await this.TaskArraysService.updateTaskStatus();
    console.log('Summary loaded succesfully:',this.TaskArraysService.tasks);
    console.log('Summary loaded succesfully:',this.ArraysService.contacts);
  }
}