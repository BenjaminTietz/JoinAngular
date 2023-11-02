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
}
