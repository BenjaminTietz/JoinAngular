import { Injectable, OnInit, EventEmitter } from '@angular/core';
import { TaskArraysService } from './task-arrays.service';
import { RemotestorageService } from './remotestorage.service';
import { BoardComponent } from './board/board.component';

@Injectable({
  providedIn: 'root'
})
export class DragAndDropService {

  currentDraggedTask: any;
  currentClickedTask: any;
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


  async moveToNewStatus(index: number, status: string) {
    // Aktualisiere den Task im Haupt-Array
    this.TaskArrayService.tasks[index].status = status;
    await this.TaskArrayService.updateTask(index, status);
    await this.TaskArrayService.safeTasks();
    await this.TaskArrayService.mapTaskStatus();
  }

/**
 * Move a task within a subarray to a new status.
 *
 * @param subArrayIndex - The index of the task within the subarray.
 * @param currentStatus - The current status of the task (e.g., 'toDo', 'inProgress', 'awaitFeedback', 'done').
 * @param newStatus - The new status to which the task should be moved.
 */
async moveToNewStatusMobile(subArrayIndex: number, currentStatus: string, newStatus: string) {
  if (newStatus === 'toDo' || newStatus === 'inProgress' || newStatus === 'awaitFeedback' || newStatus === 'done') {
    console.log('Moving task within subarray:', newStatus);

    // Determine which subarray is currently being processed
    let subArray;
    if (currentStatus === 'toDo') {
      subArray = this.TaskArrayService.toDo;
    } else if (currentStatus === 'inProgress') {
      subArray = this.TaskArrayService.inProgress;
    } else if (currentStatus === 'awaitFeedback') {
      subArray = this.TaskArrayService.awaitFeedback;
    } else if (currentStatus === 'done') {
      subArray = this.TaskArrayService.done;
    }

    if (subArrayIndex >= 0 && subArrayIndex < subArray.length) {
      // Extract the task's ID from the subarray based on the index
      const taskId = subArray[subArrayIndex].id;
      console.log('Task ID to move:', taskId);

      // Find the index of the task in the main array based on the task ID
      const taskIndex = this.TaskArrayService.tasks.findIndex(task => task.id === taskId);

      if (taskIndex >= 0) {
        console.log('Moving task with ID:', taskId, 'to new status:', newStatus);

        // Update the task's status in the main array
        this.TaskArrayService.tasks[taskIndex].status = newStatus;

        // Perform the necessary updates and storage operations
        await this.TaskArrayService.updateTask(taskIndex, newStatus);
        console.log('Task updated in the main array.');

        await this.TaskArrayService.safeTasks();
        console.log('Tasks saved.');

        await this.TaskArrayService.mapTaskStatus();
        console.log('Mapping task status.');

        // Additional necessary steps after moving the task
      }
    }
  }
}


} 
