import { Injectable, OnInit, EventEmitter } from '@angular/core';
import { TaskArraysService } from './task-arrays.service';
import { RemotestorageService } from './remotestorage.service';
import { BoardComponent } from './board/board.component';

@Injectable({
  providedIn: 'root'
})
export class DragAndDropService {

  currentDraggedTask: any;
  currentStatus: any;
  taskIndex: any;
  constructor(public TaskArrayService: TaskArraysService) { }

  async ngOnInit() {
    await this.TaskArrayService.mapTaskStatus();
  }



  dragStart(index: number, status: string) {
    // Istead of saving index, the id of the task of the subarry get stored
    if (status === 'toDo') {
      this.currentDraggedTask = this.TaskArrayService.toDo[index].id;
    } else if (status === 'inProgress') {
      this.currentDraggedTask = this.TaskArrayService.inProgress[index].id;
    } else if (status === 'awaitFeedback') {
      this.currentDraggedTask = this.TaskArrayService.awaitFeedback[index].id;
    } else if (status === 'done') {
      this.currentDraggedTask = this.TaskArrayService.done[index].id;
    }
  
    this.currentStatus = status;
    console.log('dragStart', this.currentDraggedTask);
  }

  allowDrop (event: Event) {
    event.preventDefault();
  }

  async moveTo(status: string) {
    let taskIndex = this.TaskArrayService.tasks.findIndex(task => task.id === this.currentDraggedTask);
    console.log('taskIndex', taskIndex);
  
    if (taskIndex >= 0) {
      // Aktualisiere den Task im Haupt-Array
      this.TaskArrayService.tasks[taskIndex].status = status;
      await this.TaskArrayService.updateTask(taskIndex, status);
      await this.TaskArrayService.safeTasks();
      await this.TaskArrayService.mapTaskStatus();
    }
  }


} 
