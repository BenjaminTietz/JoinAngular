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
  taskToDelete;
  searchFieldActive: boolean = false;
  searchTerm: string = '';

  constructor(
    public TaskArrayService: TaskArraysService,
    public RemotestorageService: RemotestorageService,
    public DragAndDropService: DragAndDropService
  ) {}

  async ngOnInit() {
    await this.TaskArrayService.mapTaskStatus();
  }

  onSearch(event: any) {
    const searchTerm = event.target.value;
    console.log('searchTerm', searchTerm);
  
    if (searchTerm.trim() === '') {
      this.searchFieldActive = false;
      this.TaskArrayService.filteredTasks = this.TaskArrayService.tasks;
    } else {
      this.searchFieldActive = true;
      this.TaskArrayService.filteredTasks = this.TaskArrayService.tasks.filter(task => task.title.includes(searchTerm));
  
      // Filtered tasks by status
      this.TaskArrayService.filteredToDo = this.TaskArrayService.filteredTasks.filter(task => task.status === 'toDo');
      this.TaskArrayService.filteredInProgress = this.TaskArrayService.filteredTasks.filter(task => task.status === 'inProgress');
      this.TaskArrayService.filteredAwaitFeedback = this.TaskArrayService.filteredTasks.filter(task => task.status === 'awaitFeedback');
      this.TaskArrayService.filteredDone = this.TaskArrayService.filteredTasks.filter(task => task.status === 'done');
    }
  }

  openTask(i: number, subArrayName: string) {
    if (['toDo', 'inProgress', 'awaitFeedback', 'done'].includes(subArrayName)) {
      let subArray = this.TaskArrayService[subArrayName]; // choose subarray
      if (i >= 0 && i < subArray.length) {
        let subTask = subArray[i];
        if (subTask && subTask.id !== undefined) {
          let taskId = subTask.id; // extract ID from subtask
          // find index of the task inside th main array
          let taskIndex = this.TaskArrayService.tasks.findIndex(task => task.id === taskId);
          this.taskToDelete = taskIndex;
          console.log('taskToDelete', this.taskToDelete);
          if (taskIndex !== -1) {
            this.selectedTask = this.TaskArrayService.tasks[taskIndex];
            this.floatingTaskContainer.nativeElement.classList.add('show-floating-container');
          } else {
            console.log(`Task with ID ${taskId} was not found in the main array.`);
          }
        } else {
          console.log(`ID could not be extracted from subarray entry.`);
        }
      } else {
        console.log(`Invalid index ${i} for subarray ${subArrayName}.`);
      }
    } else {
      console.log(`Invalid subarray name: ${subArrayName}.`);
    }
  }

  closeTask() {
    this.floatingTaskContainer.nativeElement.classList.toggle(
      'show-floating-container'
    );
  }

  async deleteTask() {
        console.log('taskToDelete', this.taskToDelete);
        this.TaskArrayService.tasks.splice(this.taskToDelete, 1);
        this.TaskArrayService.safeTasks();
        this.closeTask();
        await this.ngOnInit();
  }
  
  getCategoryColor(category: string): string {
    switch (category) {
      case 'sales':
        return '#e69f5d';
      case 'marketing':
        return '#f199c8';
      case 'accounting':
        return '#82fcd3';
      case 'development':
        return '#a899f5';
      case 'purchase':
        return '#d5b7f3';
      default:
        return '#000000'; // Standardfarbe für unbekannte Kategorien
    }
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
