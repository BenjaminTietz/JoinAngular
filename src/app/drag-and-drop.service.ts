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
  constructor(public TaskArrayService: TaskArraysService) { }

  async ngOnInit() {
    await this.TaskArrayService.mapTaskStatus();
  }



  dragStart(index: number, status: string) {
    this.currentDraggedTask = index;
    this.currentStatus = status;
    console.log('dragStart', this.currentDraggedTask);
    if (this.currentStatus == 'toDo') {
      console.log('currentStatus', this.TaskArrayService.toDo[this.currentDraggedTask]['status']);
      } else if (this.currentStatus == 'inProgress') {
        console.log('currentStatus', this.TaskArrayService.inProgress[this.currentDraggedTask]['status']);
      } else if (this.currentStatus == 'awaitFeedback') {
        console.log('currentStatus', this.TaskArrayService.awaitFeedback[this.currentDraggedTask]['status']);
      } else if (this.currentStatus == 'done') {
        console.log('currentStatus', this.TaskArrayService.done[this.currentDraggedTask]['status']);
      }
  }

  allowDrop (event: Event) {
    event.preventDefault();
  }

  async moveTo (status: string) {
    if (this.currentStatus == 'toDo') {
    this.TaskArrayService.toDo[this.currentDraggedTask]['status'] = status;
    } else if (this.currentStatus == 'inProgress') {
    this.TaskArrayService.inProgress[this.currentDraggedTask]['status'] = status;
    } else if (this.currentStatus == 'awaitFeedback') {
    this.TaskArrayService.awaitFeedback[this.currentDraggedTask]['status'] = status;
    } else if (this.currentStatus == 'done') {
    this.TaskArrayService.done[this.currentDraggedTask]['status'] = status;
    }
    await this.TaskArrayService.updateTask(this.currentDraggedTask, status);
    await this.TaskArrayService.safeTasks(); 
    await this.TaskArrayService.mapTaskStatus();   
  }
} 
