import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { TaskArraysService } from '../task-arrays.service';
import { RemotestorageService } from '../remotestorage.service';
import { DragAndDropService } from '../drag-and-drop.service';
import { ArraysService } from '../contact-arrays.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {Title} from "@angular/platform-browser";

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
  @ViewChild('boardWrapper') boardWrapper: ElementRef;


/**
 * Represents an event in the application.
 * 
 * @type {Event}
 */
event: Event;
/**
 * Represents the task to be deleted.
 * 
 * @type {*}
 */
taskToDelete: any;
/**
 * Indicates whether the search field is currently active or not.
 * 
 * @type {boolean}
 */
searchFieldActive: boolean = false;
/**
 * Represents the search term used in the application's search functionality.
 * 
 * @type {string}
 */
searchTerm: string = '';


  constructor(
    public TaskArrayService: TaskArraysService,
    public RemotestorageService: RemotestorageService,
    public DragAndDropService: DragAndDropService,
    public ArraysService: ArraysService,
    private titleService:Title
  ) {this.titleService.setTitle("Join - Board")}

/**
 * Lifecycle hook called after the component is initialized.
 * Loads contacts, tasks, and maps task status and urgent tasks asynchronously.
 *
 * @returns {Promise<void>} - A Promise that resolves when all asynchronous operations are complete.
 */
async ngOnInit(): Promise<void> {
  // Load contacts, tasks, and map task status and urgent tasks
  await this.ArraysService.loadContacts();
  await this.TaskArrayService.loadTasks();
  await this.TaskArrayService.mapTaskStatus();
  await this.TaskArrayService.mapUrgentTasks();
}


/**
 * Handles the search functionality based on the provided event.
 * @param {any} event - The event object containing information about the search.
 */
onSearch(event: any) {
  /**
   * The search term entered by the user.
   * @type {string}
   */
  let searchTerm = event.target.value.toLowerCase(); // Convert to lowercase for case-insensitive search
  if (searchTerm.trim() === '') {
    /**
     * Indicates whether the search field is active.
     * @type {boolean}
     */
    this.searchFieldActive = false;
    /**
     * The filtered tasks array when the search term is empty.
     * @type {Array}
     */
    this.TaskArrayService.filteredTasks = this.TaskArrayService.tasks;
  } else {
    /**
     * Indicates whether the search field is active.
     * @type {boolean}
     */
    this.searchFieldActive = true;
    /**
     * The filtered tasks array based on the search term.
     * @type {Array}
     */
    this.TaskArrayService.filteredTasks = this.TaskArrayService.tasks.filter(
      (task) =>
        task.title.toLowerCase().includes(searchTerm) ||
        task.description.toLowerCase().includes(searchTerm)
    );
    // Filtered tasks by status
    /**
     * The filtered tasks in the 'toDo' status.
     * @type {Array}
     */
    this.TaskArrayService.filteredToDo = this.TaskArrayService.filteredTasks.filter(
      (task) => task.status === 'toDo'
    );
    /**
     * The filtered tasks in the 'inProgress' status.
     * @type {Array}
     */
    this.TaskArrayService.filteredInProgress = this.TaskArrayService.filteredTasks.filter(
      (task) => task.status === 'inProgress'
    );
    /**
     * The filtered tasks in the 'awaitFeedback' status.
     * @type {Array}
     */
    this.TaskArrayService.filteredAwaitFeedback = this.TaskArrayService.filteredTasks.filter(
      (task) => task.status === 'awaitFeedback'
    );
    /**
     * The filtered tasks in the 'done' status.
     * @type {Array}
     */
    this.TaskArrayService.filteredDone = this.TaskArrayService.filteredTasks.filter(
      (task) => task.status === 'done'
    );
  }
}

/**
 * Opens a task for detailed view based on its index and subarray name.
 *
 * @param {number} i - The index of the task in the subarray.
 * @param {string} subArrayName - The name of the subarray containing the task.
 *                                Valid subarray names are: 'toDo', 'inProgress', 'awaitFeedback', 'done'.
 * @returns {void}
 */
async openTask(i: number, subArrayName: string): Promise<void> {
  if (['toDo', 'inProgress', 'awaitFeedback', 'done'].includes(subArrayName)) {
    let subArray = this.TaskArrayService[subArrayName]; // Choose subarray

    if (i >= 0 && i < subArray.length) {
      let subTask = subArray[i];

      if (subTask && subTask.id !== undefined) {
        let taskId = subTask.id; // Extract ID from subtask

        // Find the index of the task inside the main array
        let taskIndex = this.TaskArrayService.tasks.findIndex((task) => task.id === taskId);
        this.taskToDelete = taskIndex;

        if (taskIndex !== -1) {
          this.TaskArrayService.selectedTask = this.TaskArrayService.tasks[taskIndex];
          this.floatingTaskContainer.nativeElement.classList.add('show-floating-container');
        }
      }
    }
  }
}

/**
 * Closes the floating task container by toggling the 'show-floating-container' class.
 * This function is typically used to hide a detailed task view.
 *
 * @returns {void}
 */
closeTask(): void {
  this.floatingTaskContainer.nativeElement.classList.toggle(
    'show-floating-container'
  );
}

/**
 * Deletes the currently selected task, updates task arrays, and triggers necessary actions.
 * This function is typically called when a user decides to delete a task.
 *
 * @returns {void}
 */
deleteTask(): void {
  // Display success delete message
  this.showSuccessDeleteMessage();

  // Remove the selected task from the tasks array
  this.TaskArrayService.tasks.splice(this.taskToDelete, 1);

  // Reset the selected task to null
  this.TaskArrayService.selectedTask = null;

  // Save the updated tasks array
  this.TaskArrayService.safeTasks();

  // Close the floating task container
  this.closeTask();

  // Reinitialize the component (if needed)
  this.TaskArrayService.ngOnInit();
  this.ngOnInit();
}

/**
 * Returns the color associated with a given task category.
 * If the category is not found, a default color is returned.
 *
 * @param {string} category - The category for which to retrieve the color.
 *                           Valid categories are: 'sales', 'marketing', 'accounting', 'development', 'purchase'.
 * @returns {string} - The color code associated with the provided category.
 */
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
      return '#000000'; // Default color for unknown categories
  }
}

/**
 * Highlights a specific drag area based on the provided identifier.
 *
 * @param {string} id - The identifier of the drag area to highlight.
 *                      Valid identifiers are: 'toDo', 'inProgress', 'awaitFeedback', 'done'.
 * @returns {void}
 */
highlight(id: string): void {
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

/**
 * Removes the highlight from a specific drag area based on the provided identifier.
 *
 * @param {string} id - The identifier of the drag area to remove the highlight.
 *                      Valid identifiers are: 'toDo', 'inProgress', 'awaitFeedback', 'done'.
 * @returns {void}
 */
removeHighlight(id: string): void {
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

/**
 * Selects a priority level and updates the styling of priority buttons accordingly.
 *
 * @param {string} priority - The selected priority level.
 *                            Valid priority levels are: 'urgent', 'medium', 'low'.
 * @returns {void}
 */
selectPriority(priority: string): void {
  this.TaskArrayService.selectedPriority = priority;
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

/**
 * Selects a priority level for editing a task and updates the styling of priority buttons accordingly.
 *
 * @param {string} priority - The selected priority level for editing.
 *                            Valid priority levels are: 'urgent', 'medium', 'low'.
 * @returns {void}
 */
selectPriorityEdit(priority: string): void {
  this.TaskArrayService.selectedEditPriority = priority;
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

/**
 * Toggles the visibility of the assigned dropdown and updates the assignedDropdownVisible flag.
 * This function is typically used to show or hide the assigned dropdown in the UI.
 *
 * @returns {void}
 */
showAssignDropdown(): void {
  // Toggle the visibility of assigned dropdowns
  this.assignedDropdown.nativeElement.classList.toggle('show-assigned-dropdown');
  this.assignedDropdownEdit.nativeElement.classList.toggle('show-assigned-dropdown');
  // Toggle the assignedDropdownVisible flag
  if (this.TaskArrayService.assignedDropdownVisible === false) {
    this.TaskArrayService.assignedDropdownVisible = true;
  } else {
    this.TaskArrayService.assignedDropdownVisible = false;
  }
}

/**
 * Displays the floating container for adding a new task and sets the assign status.
 *
 * @param {string} status - The status for assigning the new task.
 * @returns {Promise<void>} - A Promise that resolves when the floating container is displayed.
 */
async showAddtaskFloatingContainer(status: string): Promise<void> {
  // Set the assign status for the new task
  this.TaskArrayService.assignStatus = status;
  // Add classes to show the add task wrapper and fix the board wrapper
  this.addtaskWrapper.nativeElement.classList.add('show-addtask-wrapper');
  this.boardWrapper.nativeElement.classList.add('fix-board-wrapper');
  // TODO: Reset form
  // Return a Promise (currently not awaiting anything, but can be modified if needed)
}

/**
 * Hides the floating container for adding a new task and resets associated UI elements.
 *
 * @returns {Promise<void>} - A Promise that resolves when the floating container is hidden.
 */
async hideAddtaskFloatingContainer(): Promise<void> {
  // Remove priority color classes
  this.prioUrgentEdit.nativeElement.classList.remove('assign-color-urgent');
  this.prioMediumEdit.nativeElement.classList.remove('assign-color-medium');
  this.prioLowEdit.nativeElement.classList.remove('assign-color-low');
  // Remove the fix-board-wrapper class
  this.boardWrapper.nativeElement.classList.remove('fix-board-wrapper');
  // Reinitialize the component (if needed)
  await this.ngOnInit();
  // Remove classes to hide the add task wrapper and display the task category wrapper
  this.addtaskWrapper.nativeElement.classList.remove('show-addtask-wrapper');
  this.taskCategoryWrapper.nativeElement.classList.remove('display-none');
  // TODO: Reset form
  // Return a Promise (currently not awaiting anything, but can be modified if needed)
}

/**
 * Displays the floating container for editing a task and populates the form with task details.
 *
 * @param {Object} selectedTask - The task to be edited.
 * @returns {Promise<void>} - A Promise that resolves when the floating container is displayed.
 */
  async showEditTaskFloatingContainer(selectedTask) {
    // Retrieve and set the index of the selected task
    await this.TaskArrayService.getIndexOfSelectedTask();
    // Transfer subtasks from the main tasks array to the subtasks array
    this.TaskArrayService.pushFromTaskArraytoSubtaskArray();
    // Set the selected task
    this.TaskArrayService.selectedTask = selectedTask;
    // Populate the edit task form with details from the selected task
    this.TaskArrayService.editTaskForm.patchValue({
      title: selectedTask.title,
      description: selectedTask.description,
      date: selectedTask.date,
      category: selectedTask.category,
      prio: selectedTask.prio,
      status: selectedTask.status,
      subtasks: selectedTask.subtasks,
    });
    // Copy subtasks from the main tasks array to the selected task
    this.TaskArrayService.selectedTask.subtasks =
      this.TaskArrayService.tasks[this.TaskArrayService.selectedTaskIndex].subtasks;
      // Add class to show the edit task wrapper
    this.editTaskWrapper.nativeElement.classList.add('show-edittask-wrapper');
// Mark title and description controls as touched in the form
    this.TaskArrayService.editTaskFormFB.get('title').markAsTouched();
    this.TaskArrayService.editTaskFormFB.get('description').markAsTouched();
    // Add class to fix the board wrapper
    this.boardWrapper.nativeElement.classList.add('fix-board-wrapper');
  }

/**
 * Hides the floating container for editing a task and performs cleanup actions.
 *
 * @returns {Promise<void>} - A Promise that resolves when the floating container is hidden.
 */
async hideEditTaskFloatingContainer(): Promise<void> {
  // Clear the selected task
  this.TaskArrayService.selectedTask = null;
  // Close the task
  this.closeTask();
  // Clear assigned data in the TaskArrayService
  this.TaskArrayService.clearAssignedData();
  // Reset the edit task form in the TaskArrayService
  await this.TaskArrayService.resetEditTaskForm();
  // Reinitialize the TaskArrayService (if needed)
  await this.TaskArrayService.ngOnInit();
  // Reinitialize the component (if needed)
  await this.ngOnInit();
  // Remove class to hide the edit task wrapper
  this.editTaskWrapper.nativeElement.classList.remove('show-edittask-wrapper');
  // Remove class to unfix the board wrapper
  this.boardWrapper.nativeElement.classList.remove('fix-board-wrapper');
  // Return a Promise (currently not awaiting anything, but can be modified if needed)
}

/**
 * Displays a success message popup for editing a task and resets priority color classes.
 *
 * @returns {void}
 */
showSuccessEditMessage(): void {
  // Add class to show the success message popup
  this.popupEditedContainer.nativeElement.classList.add('showPopup');
  // Set a timeout to remove the showPopup class after a delay (e.g., 1000 milliseconds)
  setTimeout(() => {
    this.popupEditedContainer.nativeElement.classList.remove('showPopup');
  }, 1000);
  // Remove priority color classes
  this.prioUrgentEdit.nativeElement.classList.remove('assign-color-urgent');
  this.prioMediumEdit.nativeElement.classList.remove('assign-color-medium');
  this.prioLowEdit.nativeElement.classList.remove('assign-color-low');
}

/**
 * Displays a success message popup for creating a task.
 *
 * @returns {void}
 */
showSuccessCreateMessage(): void {
  // Add class to show the success message popup
  this.popupCreateContainer.nativeElement.classList.add('showPopup');
  // Set a timeout to remove the showPopup class after a delay (e.g., 1000 milliseconds)
  setTimeout(() => {
    this.popupCreateContainer.nativeElement.classList.remove('showPopup');
  }, 1000);
}

/**
 * Displays a success message popup for deleting a task.
 *
 * @returns {void}
 */
showSuccessDeleteMessage(): void {
  // Add class to show the success message popup
  this.popupdeletedContainer.nativeElement.classList.add('showPopup');
  // Set a timeout to remove the showPopup class after a delay (e.g., 1000 milliseconds)
  setTimeout(() => {
    this.popupdeletedContainer.nativeElement.classList.remove('showPopup');
  }, 1000);
}

}
