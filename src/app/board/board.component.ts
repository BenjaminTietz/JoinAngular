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
      const subArray = this.TaskArrayService[subArrayName]; // Subarray auswählen
      if (i >= 0 && i < subArray.length) {
        const subTask = subArray[i];
        if (subTask && subTask.id !== undefined) {
          const taskId = subTask.id; // Extrahiere die ID
          // Finde den Index der Aufgabe im Hauptarray
          const taskIndex = this.TaskArrayService.tasks.findIndex(task => task.id === taskId);
          this.taskToDelete = taskIndex;
          console.log('taskToDelete', this.taskToDelete);
          if (taskIndex !== -1) {
            this.selectedTask = this.TaskArrayService.tasks[taskIndex];
            this.floatingTaskContainer.nativeElement.classList.add('show-floating-container');
          } else {
            console.log(`Aufgabe mit ID ${taskId} wurde nicht im Hauptarray gefunden.`);
          }
        } else {
          console.log(`ID konnte nicht aus dem Subarray-Eintrag extrahiert werden.`);
        }
      } else {
        console.log(`Ungültiger Index ${i} für Subarray ${subArrayName}.`);
      }
    } else {
      console.log(`Ungültiger Subarray-Name: ${subArrayName}.`);
    }
  }

  closeTask() {
    this.floatingTaskContainer.nativeElement.classList.toggle(
      'show-floating-container'
    );
  }

  async deleteTask() {
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
