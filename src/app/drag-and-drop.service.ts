import { Injectable } from '@angular/core';
import { TaskArraysService } from './task-arrays.service';
import { RemotestorageService } from './remotestorage.service';
import { BoardComponent } from './board/board.component';

@Injectable({
  providedIn: 'root'
})
export class DragAndDropService {

  currentDraggedTask: any;

  constructor(public TaskArrayService: TaskArraysService) { }

  dragStart(index: number) {
    this.currentDraggedTask = index;
    console.log('dragStart', this.currentDraggedTask);
    console.log('moveTo', this.TaskArrayService.tasks[this.currentDraggedTask]['status']);
  }

  allowDrop (ev) {
    debugger;
    ev.preventDefault();
  }

  moveTo (status: string) {
    this.TaskArrayService.tasks[this.currentDraggedTask]['status'] = status;
    console.log('moveTo', status);
    
  }
}
