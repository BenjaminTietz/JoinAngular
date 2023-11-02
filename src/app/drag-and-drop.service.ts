import { Injectable, OnInit, EventEmitter } from '@angular/core';
import { TaskArraysService } from './task-arrays.service';
import { RemotestorageService } from './remotestorage.service';
import { BoardComponent } from './board/board.component';

@Injectable({
  providedIn: 'root'
})
export class DragAndDropService {

  currentDraggedTask: any;

  constructor(public TaskArrayService: TaskArraysService) { }

  async ngOnInit() {
  }



  dragStart(index: number) {
    this.currentDraggedTask = index;
    console.log('dragStart', this.currentDraggedTask);
    console.log('currentStatus', this.TaskArrayService.tasks[this.currentDraggedTask]['status']);
  }

  allowDrop (event: { preventDefault: () => void; }) {
    console.log('allowDrop is active');
    event.preventDefault();
  }

  moveTo (status: string) {

    this.TaskArrayService.tasks[this.currentDraggedTask]['status'] = status;
    console.log('currentStatus', status);
    
  }
}
