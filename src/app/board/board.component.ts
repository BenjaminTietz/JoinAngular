import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { TaskArraysService } from '../task-arrays.service';
import { RemotestorageService } from '../remotestorage.service';
import { DragAndDropService } from '../drag-and-drop.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent {
  @ViewChild('floatingTaskContainer') floatingTaskContainer: ElementRef;
  @ViewChild('toDo') toDo: ElementRef;
  @ViewChild('inProgress') inProgress: ElementRef;
  @ViewChild('awaitFeedback') awaitFeedback: ElementRef;
  @ViewChild('done') done: ElementRef;

  selectedTask: any;

  event: Event;
  
  constructor(
    public TaskArrayService: TaskArraysService,
    public RemotestorageService: RemotestorageService,
    public DragAndDropService: DragAndDropService
  ) {}

  async ngOnInit() {
    await this.TaskArrayService.mapTaskStatus();
  }



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

  deleteTask(i: number) {
    this.TaskArrayService.tasks.splice(i, 1);
    this.TaskArrayService.safeTasks();
    this.closeTask();
  }

  highlight (id) {
    if (id === 'toDo') {
    this.toDo.nativeElement.classList.add('drag-area-heighlight');
    } else if (id === 'inProgress') {
    this.inProgress.nativeElement.classList.add('drag-area-heighlight');
    } else if (id === 'awaitFeedback') {
    this.awaitFeedback.nativeElement.classList.add('drag-area-heighlight');
    } else if (id === 'done') {
    this.done.nativeElement.classList.add('drag-area-heighlight');
    }
  }
  removeHighlight (id) {
    if (id === 'toDo') {
    this.toDo.nativeElement.classList.remove('drag-area-heighlight');
    } else if (id === 'inProgress') {
    this.inProgress.nativeElement.classList.remove('drag-area-heighlight');
    } else if (id === 'awaitFeedback') {
    this.awaitFeedback.nativeElement.classList.remove('drag-area-heighlight');
    } else if (id === 'done') {
    this.done.nativeElement.classList.remove('drag-area-heighlight');
    }
  }
}
