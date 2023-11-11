import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { TaskArraysService } from '../task-arrays.service';
import { RemotestorageService } from '../remotestorage.service';
import { DragAndDropService } from '../drag-and-drop.service';
import { ArraysService } from '../contact-arrays.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

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
  @ViewChild('prioUrgent') prioUrgent: ElementRef;
  @ViewChild('prioMedium') prioMedium: ElementRef;
  @ViewChild('prioLow') prioLow: ElementRef;
  @ViewChild('prioUrgentEdit') prioUrgentEdit: ElementRef;
  @ViewChild('prioMediumEdit') prioMediumEdit: ElementRef;
  @ViewChild('prioLowEdit') prioLowEdit: ElementRef;
  @ViewChild('assignedDropdown') assignedDropdown: ElementRef;
  @ViewChild('assignedDropdownEdit') assignedDropdownEdit: ElementRef;
  @ViewChild('addtaskWrapper') addtaskWrapper: ElementRef;
  @ViewChild('editTaskWrapper') editTaskWrapper: ElementRef;
  @ViewChild('taskCategoryWrapper') taskCategoryWrapper: ElementRef;
  @ViewChild('popupEditedContainer') popupEditedContainer: ElementRef;
  @ViewChild('popupdeletedContainer') popupdeletedContainer: ElementRef;
  @ViewChild('popupCreateContainer') popupCreateContainer: ElementRef;

  event: Event;
  taskToDelete;
  searchFieldActive: boolean = false;
  searchTerm: string = '';

  constructor(
    public TaskArrayService: TaskArraysService,
    public RemotestorageService: RemotestorageService,
    public DragAndDropService: DragAndDropService,
    public ArraysService: ArraysService,
  ) {
    console.log('board loaded', this.TaskArrayService.selectedTask);
  }

  async ngOnInit() {
    await this.ArraysService.loadContacts();
    await this.TaskArrayService.loadTasks();
    await this.TaskArrayService.mapTaskStatus();
    await this.TaskArrayService.mapUrgentTasks()
  }



  onSearch(event: any) {
    const searchTerm = event.target.value;
    console.log('searchTerm', searchTerm);

    if (searchTerm.trim() === '') {
      this.searchFieldActive = false;
      this.TaskArrayService.filteredTasks = this.TaskArrayService.tasks;
    } else {
      this.searchFieldActive = true;
      this.TaskArrayService.filteredTasks = this.TaskArrayService.tasks.filter(
        (task) => task.title.includes(searchTerm)
      );

      // Filtered tasks by status
      this.TaskArrayService.filteredToDo =
        this.TaskArrayService.filteredTasks.filter(
          (task) => task.status === 'toDo'
        );
      this.TaskArrayService.filteredInProgress =
        this.TaskArrayService.filteredTasks.filter(
          (task) => task.status === 'inProgress'
        );
      this.TaskArrayService.filteredAwaitFeedback =
        this.TaskArrayService.filteredTasks.filter(
          (task) => task.status === 'awaitFeedback'
        );
      this.TaskArrayService.filteredDone =
        this.TaskArrayService.filteredTasks.filter(
          (task) => task.status === 'done'
        );
    }
  }

  async openTask(i: number, subArrayName: string) {
    if (
      ['toDo', 'inProgress', 'awaitFeedback', 'done'].includes(subArrayName)
    ) {
      let subArray = this.TaskArrayService[subArrayName]; // choose subarray
      if (i >= 0 && i < subArray.length) {
        let subTask = subArray[i];
        if (subTask && subTask.id !== undefined) {
          let taskId = subTask.id; // extract ID from subtask
          // find index of the task inside th main array
          let taskIndex = this.TaskArrayService.tasks.findIndex(
            (task) => task.id === taskId
          );
          this.taskToDelete = taskIndex;
          console.log('taskToDelete', this.taskToDelete);
          if (taskIndex !== -1) {
            this.TaskArrayService.selectedTask =
              this.TaskArrayService.tasks[taskIndex];
            console.log('board loaded', this.TaskArrayService.selectedTask);
            this.floatingTaskContainer.nativeElement.classList.add(
              'show-floating-container'
            );
          } else {
            console.log(
              `Task with ID ${taskId} was not found in the main array.`
            );
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
    this.showSuccessDeleteMessage();
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

  highlight(id) {
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

  removeHighlight(id) {
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

  highlightTask() {}

  selectPriority(priority: string) {
    this.TaskArrayService.selectedPriority = priority;
    console.log(this.TaskArrayService.selectedPriority);

    if (this.TaskArrayService.selectedPriority === 'urgent') {
      this.prioUrgent.nativeElement.classList.toggle('assign-color-urgent');
      this.prioMedium.nativeElement.classList.remove('assign-color-medium');
      this.prioLow.nativeElement.classList.remove('assign-color-low');
    } else if (this.TaskArrayService.selectedPriority === 'medium') {
      this.prioMedium.nativeElement.classList.toggle('assign-color-medium');
      this.prioUrgent.nativeElement.classList.remove('assign-color-urgent');
      this.prioLow.nativeElement.classList.remove('assign-color-low');
    } else if (this.TaskArrayService.selectedPriority === 'low') {
      this.prioLow.nativeElement.classList.toggle('assign-color-low');
      this.prioUrgent.nativeElement.classList.remove('assign-color-urgent');
      this.prioMedium.nativeElement.classList.remove('assign-color-medium');
    }
  }

  selectPriorityEdit(priority: string) {
    this.TaskArrayService.selectedEditPriority = priority;
    console.log(this.TaskArrayService.selectedEditPriority);

    if (this.TaskArrayService.selectedEditPriority === 'urgent') {
      this.prioUrgentEdit.nativeElement.classList.toggle('assign-color-urgent');
      this.prioMediumEdit.nativeElement.classList.remove('assign-color-medium');
      this.prioLowEdit.nativeElement.classList.remove('assign-color-low');
    } else if (this.TaskArrayService.selectedEditPriority === 'medium') {
      this.prioMediumEdit.nativeElement.classList.toggle('assign-color-medium');
      this.prioUrgentEdit.nativeElement.classList.remove('assign-color-urgent');
      this.prioLowEdit.nativeElement.classList.remove('assign-color-low');
    } else if (this.TaskArrayService.selectedEditPriority === 'low') {
      this.prioLowEdit.nativeElement.classList.toggle('assign-color-low');
      this.prioUrgentEdit.nativeElement.classList.remove('assign-color-urgent');
      this.prioMediumEdit.nativeElement.classList.remove('assign-color-medium');
    }
  }

  showAssignDropdown() {
    this.assignedDropdown.nativeElement.classList.toggle(
      'show-assigned-dropdown'
    );
    this.assignedDropdownEdit.nativeElement.classList.toggle(
      'show-assigned-dropdown'
    );
    if (this.TaskArrayService.assignedDropdownVisible == false) {
      this.TaskArrayService.assignedDropdownVisible = true;
    } else {
      this.TaskArrayService.assignedDropdownVisible = false;
    }
  }

  async showAddtaskFloatingContainer(status: string) {
    console.log('Received status:', status);
    this.TaskArrayService.assignStatus = status;
    console.log(
      'this.TaskArrayService.assignStatus',
      this.TaskArrayService.assignStatus
    );
    this.addtaskWrapper.nativeElement.classList.add('show-addtask-wrapper');
    this.taskCategoryWrapper.nativeElement.classList.add('display-none');
    console.log('this.taskCategoryWrapper', this.taskCategoryWrapper);
    //TO-DO: Reset form
  }
  async hideAddtaskFloatingContainer() {
    await this.ngOnInit();
    this.addtaskWrapper.nativeElement.classList.remove('show-addtask-wrapper');
    this.taskCategoryWrapper.nativeElement.classList.remove('display-none');
    //TO-DO: Reset form
  }
  async showEditTaskFloatingContainer(selectedTask) {
    await this.TaskArrayService.getIndexOfSelectedTask();
    this.TaskArrayService.pushFromTaskArraytoSubtaskArray();
    this.TaskArrayService.selectedTask = selectedTask;
  
    // Löschen Sie das `subtask`-Feld aus dem ausgewählten Task
    selectedTask.subtask = [];
  
    // Löschen Sie das `subtask`-Formularfeld
    this.TaskArrayService.editTaskForm.get('subtask').reset();
  
    // Aktualisieren Sie das Formular mit den Werten aus dem ausgewählten Task
    this.TaskArrayService.editTaskForm.patchValue({
      title: selectedTask.title,
      description: selectedTask.description,
      date: selectedTask.date,
      category: selectedTask.category,
    });
  
    console.log('selectedTask', this.TaskArrayService.selectedTask);
    this.editTaskWrapper.nativeElement.classList.add('show-edittask-wrapper');
  }

  async hideEditTaskFloatingContainer() {
  
    this.closeTask();
    this.TaskArrayService.assignStatus = '';
    this.TaskArrayService.subtasks = [];
    this.TaskArrayService.clearAssignedData();

    await this.TaskArrayService.resetEditTaskForm();
    await this.ngOnInit();
    this.editTaskWrapper.nativeElement.classList.remove(
      'show-edittask-wrapper'
    );
  }



  showSuccessEditMessage() {
    this.popupEditedContainer.nativeElement.classList.add('showPopup');
    setTimeout(() => {
      this.popupEditedContainer.nativeElement.classList.remove('showPopup');
    }, 1000);
    this.prioUrgentEdit.nativeElement.classList.remove('assign-color-urgent');
    this.prioMediumEdit.nativeElement.classList.remove('assign-color-urgent');
    this.prioMediumEdit.nativeElement.classList.remove('assign-color-medium');
  }
  showSuccessCreateMessage() {
    this.popupCreateContainer.nativeElement.classList.add('showPopup');
    setTimeout(() => {
      this.popupCreateContainer.nativeElement.classList.remove('showPopup');
    }, 1000);
  }

  showSuccessDeleteMessage() {
    this.popupdeletedContainer.nativeElement.classList.add('showPopup');
    setTimeout(() => {
      this.popupdeletedContainer.nativeElement.classList.remove('showPopup');
    }, 1000);
  }
}
