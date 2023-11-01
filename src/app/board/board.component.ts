import { Component, OnInit, ViewChild, ElementRef, TemplateRef } from '@angular/core';
import { TaskArraysService } from '../task-arrays.service';
import { RemotestorageService } from '../remotestorage.service';
import { DragAndDropService } from '../drag-and-drop.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
  template: `
    <ng-template #singleTask>
      <div draggable="true" (click)="openTask(i)" class="single-task">
        <div class="task-category">
          {{ task.category }}
        </div>
        <div class="task-content">
          <div class="task-name">
            {{ task.title }}
          </div>
          <div class="task-description">
            {{ task.description }}
          </div>
        </div>
        <div *ngIf="this.TaskArrayService.tasks[i].subtask" class="progressbar">
          {{ task.subtask }}
        </div>
        <div class="single-task-bottom">
          <div class="assigned-contacts">{{ task.assigned }}</div>
          <img class="prio" src="assets/img/board/prio_urgent.svg" />
        </div>
      </div>
    </ng-template>
  `,
})
export class BoardComponent {
  @ViewChild('floatingTaskContainer') floatingTaskContainer: ElementRef;
  @ViewChild('singleTask') singleTaskTemplate: TemplateRef<any>;
  event: any;
  selectedTask: any;

  constructor(
    public TaskArrayService: TaskArraysService,
    public RemotestorageService: RemotestorageService,
    public DragAndDropService: DragAndDropService
  ) {}

  async ngOnInit() {}

  openTask(i: number) {
    this.selectedTask = this.TaskArrayService.tasks[i];
    this.floatingTaskContainer.nativeElement.classList.add(
      'show-floating-container'
    );
  }

  closeTask() {
    this.floatingTaskContainer.nativeElement.classList.toggle(
      'show-floating-container'
    );
  }
}
