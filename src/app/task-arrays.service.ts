import { Injectable, OnInit, ViewChild, ElementRef } from '@angular/core';
import { RemotestorageService } from './remotestorage.service';
import { ArraysService } from './contact-arrays.service';
import { AddtaskComponent } from './addtask/addtask.component';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { BoardService } from './board.service';
import { FormArray } from '@angular/forms';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class TaskArraysService {
  @ViewChild('assignedDropdown') assignedDropdown: ElementRef;
  @ViewChild('inputName') inputName: ElementRef;
  @ViewChild('inputEmail') inputEmail: ElementRef;
  @ViewChild('inputPhone') inputPhone: ElementRef;
  @ViewChild('addContactContainer') addContactContainer: ElementRef;
  @ViewChild('editContactContainer') editContactContainer: ElementRef;
  @ViewChild('popupCreatedContainer') popupCreatedContainer: ElementRef;


  public addTaskForm: FormGroup = new FormGroup({
    title: new FormControl('', [Validators.required, Validators.maxLength(30)]),
    description: new FormControl('', [Validators.maxLength(120)]),
    date: new FormControl('', [Validators.required]),
    category: new FormControl('', [Validators.required]),
    subtask: new FormControl('', []),
    assignedContacts: this.fb.array([]),
  });

  public editTaskForm: FormGroup = new FormGroup({
    title: new FormControl('', [Validators.required, Validators.maxLength(30)]),
    description: new FormControl('', [Validators.maxLength(120)]),
    date: new FormControl('', [Validators.required]),
    category: new FormControl('', [Validators.required]),
    subtask: new FormControl('', []),
    assignedContacts: this.fb.array([]),
  });

  public addTaskFormFB: FormGroup;
  public editTaskFormFB: FormGroup;

  constructor(
    public RemotestorageService: RemotestorageService,
    public ArraysService: ArraysService,
    private fb: FormBuilder,
    private boardService: BoardService
  ) {
    this.addTaskFormFB = this.fb.group({
      title: new FormControl('', [Validators.required, Validators.maxLength(30)]),
      description: new FormControl('', [Validators.maxLength(120)]),
      date: new FormControl('', [Validators.required]),
      category: new FormControl('', [Validators.required]),
      subtask: new FormControl('', []),
      assignedContacts: this.fb.array([]),

    });


    this.editTaskFormFB = this.fb.group({
      title: new FormControl('', [Validators.required, Validators.maxLength(30)]),
      description: new FormControl('', [Validators.maxLength(120)]),
      date: new FormControl('', [Validators.required]),
      category: new FormControl('', [Validators.required]),
      subtask: new FormControl('', []),
      assignedContacts: this.fb.array([]),
    });



    let currentDate = new Date();
    this.minDate = currentDate.toISOString().split('T')[0];
    this.subtasks = [];
  }

/**
 * The minimum date value used for date selection.
 * @type {string}
 */
minDate: string;

/**
 * The selected priority for a task.
 * @type {string}
 */
selectedPriority: string = '';

/**
 * The selected priority for editing a task.
 * @type {string}
 */
selectedEditPriority: string = 'low';

/**
 * Indicates whether the assigned dropdown for a task is visible.
 * @type {boolean}
 */
assignedDropdownVisible: boolean = false;

/**
 * The identifier for a task.
 * @type {number}
 */
taskId: number = 0;

/**
 * The date of the nearest urgent task.
 * @type {any}
 */
nearestTaskDate: any = '';

/**
 * The selected task object.
 * @type {any}
 */
selectedTask: any;

/**
 * The index of the selected task.
 * @type {number}
 */
selectedTaskIndex: number;

/**
 * Asynchronous lifecycle method that initializes the component.
 * It loads tasks, loads contacts, updates the "selected" status of contacts,
 * and generates task IDs.
 *
 * @returns {Promise<void>}
 */
async ngOnInit() {
  // Clear tasks array (if needed).
  // await this.clearTasksArray();

  // Load tasks from a data source.
  await this.loadTasks();
  // Load contacts from a data source.
  await this.ArraysService.loadContacts();
  // Update the "selected" status of contacts.
  this.ArraysService.contacts.forEach(contact => {
    contact.selected = false;
  });
  // Generate task IDs.
  await this.generateTaskId();
}

  /**
   * An array to store tasks.
   * @type {Array}
   */
  tasks = [];

  /**
   * An array to store filtered tasks.
   * @type {Array}
   */
  filteredTasks = [];
  
  /**
   * An subarray to store filtered tasks splitted into status 'toDo'.
   * @type {Array}
   */
  filteredToDo = [];

    /**
   * An subarray to store filtered tasks splitted into status 'inProgress'.
   * @type {Array}
   */
  filteredInProgress = [];

    /**
   * An subarray to store filtered tasks splitted into status 'awaitFeedback'.
   * @type {Array}
   */
  filteredAwaitFeedback = [];

    /**
   * An subarray to store filtered tasks splitted into status 'done'.
   * @type {Array}
   */
  filteredDone = [];

  /**
   * An subarray to store tasks with status = "toDo".
   * @type {Array}
   */
  toDo = [];

  /**
   * An subarray to store tasks with status = "inProgress".
   * @type {Array}
   */
  inProgress = [];

  /**
   * An subarray to store tasks with status = "awaitFeedback".
   * @type {Array}
   */
  awaitFeedback = [];

  /**
   * An subarray to store tasks with status = "done".
   * @type {Array}
   */
  done = [];

  /**
   * An subarray to store tasks with prio = "urgent".
   * @type {Array}
   */
  urgent = [];

  /**
   * An subarray to store subtasks .
   * @type {Array}
   */
  subtasks: { name: string, completed: boolean }[] = [];

    /**
   * An subarray to store subtasks .
   * @type {Array}
   */
    newSubtasks: { name: string, completed: boolean }[] = [];

  /**
   * An subarray to store state of subtasks .
   * @type {Array}
   */
  subtaskStatus: boolean[] = [];

  /**
   * An subarray to store state of subtasks .
   * @type {Array}
   */
  subtasksDone = [];

  /**
   * An subarray to store assigned User .
   * @type {Array}
   */
  assignedUser = [];

/**
 * An array representing assigned contacts, typically used in a FormArray.
 * @type {FormArray[]}
 */
assignedContacts = [new FormArray([])];

  /**
   * An array to store string of status of the Task which gets added e.g('toDo,inProgress,awaitingFeedback') .
   * @type {Array}
   */
  assignStatus: string ;

/**
 * For development mode only: Clears the entire Tasks array by overwriting it with an empty array.
 * This function should not be used in production.
 */
  clearTasksArray() {
  // Clear the entire Tasks array by overwriting it with an empty array.
  this.tasks = [];
  // Save the updated tasks.
  this.safeTasks();
}

/**
 * Add or remove a contact from the assigned contacts array and form control.
 *
 * @param {any} contact - The contact to be added or removed from the assigned contacts.
 */
  pushToAssignedArray(contact) {
  /**
   * The FormArray representing assigned contacts within the add task form.
   * @type {FormArray}
   */
  let assignedContacts = this.addTaskForm.get('assignedContacts') as FormArray;

  // Check if the contact is already in the array
  let index = assignedContacts.value.findIndex(c => c.id === contact.id);

  if (index === -1) {
    // Contact is not in the array, so add it to the form control
    assignedContacts.push(this.fb.control(contact));

    // Push the contact to the local array
    this.assignedUser.push(contact);
  } else {
    // Contact is already in the array, so remove it from the form control
    assignedContacts.removeAt(index);

    // Remove the contact from the local array
    this.assignedUser.splice(index, 1);
  }
}

/**
 * Add or remove a contact from the assigned contacts array within the edit task form.
 *
 * @param {any} contact - The contact to be added or removed from the assigned contacts.
 */
  pushToAssignedArrayFromEdit(contact) {
  /**
   * The FormArray representing assigned contacts within the edit task form.
   * @type {FormArray}
   */
  let assigned = this.editTaskForm.get('assignedContacts') as FormArray;

  // Check if the contact is already in the array
  let index = assigned.value.findIndex(c => c.id === contact.id);

  if (index === -1) {
    // Contact is not in the array, so add it to the form control
    assigned.push(this.fb.control(contact));

    // Push the contact to the local array
    this.assignedUser.push(contact);
  } else {
    // Contact is already in the array, so remove it from the form control
    assigned.removeAt(index);

    // Filter out the contact from the local array
    this.assignedUser = this.assignedUser.filter(c => c.id !== contact.id);
  }
}

/**
 * Remove a contact from the assigned contacts array within the add task form.
 *
 * @param {number} index - The index of the contact to be removed from the assigned contacts.
 */
  removeFromAssignedArray(index) {
  /**
   * The FormArray representing assigned contacts within the add task form.
   * @type {FormArray}
   */
  let assignedContacts = this.addTaskForm.get('assignedContacts') as FormArray;

  // Remove the contact at the specified index from the form control.
  assignedContacts.removeAt(index);
}

/**
 * Clear assigned contact data by resetting the local and form control representations.
 */
  clearAssignedData() {
  // Clear the local assignedUser array.
  this.assignedUser = [];
  /**
   * The FormArray representing assigned contacts within the add task form.
   * @type {FormArray}
   */
  let assignedContacts = this.addTaskForm.get('assignedContacts') as FormArray;
  // Clear the FormArray.
  assignedContacts.clear();
}

/**
 * Push subtasks from the selected task in the task array to the subtask array.
 */
  pushFromTaskArraytoSubtaskArray() {
  // Get the subtasks from the selected task in the task array.
  let subtask = this.tasks[this.selectedTaskIndex].subtask;
  if (subtask) {
    // Push the subtasks to the subtask array.
    this.subtasks.push(...subtask);
  }
}

/**
 * Find and set the index of the selected task within the "tasks" array.
 */
  getIndexOfSelectedTask() {
  /**
   * The index of the selected task within the "tasks" array.
   * @type {number}
   */
  let index = this.tasks.findIndex(task => task.id === this.selectedTask.id);

  // Set the selected task index.
  this.selectedTaskIndex = index;
}

/**
 * Asynchronous function to generate a unique task ID.
 * It filters out existing IDs from the "tasks" array and converts them to numbers.
 * If the "tasks" array is empty, it sets the task ID to 1.
 *
 * @returns {Promise<void>}
 */
async generateTaskId() {
  // Filter out existing IDs from the "tasks" array and convert them to numbers.
  let taskIds = this.tasks.length;
  // If the "tasks" array is empty, set the task ID to 1.
  if (this.tasks.length === 0) {
    this.taskId = 1;
  }
}

/**
 * Asynchronous function to add a new task to the "task" array if the provided data is valid.
 *
 * @param {object} data - Data containing task details to be added.
 * @returns {Promise<void>}
 */
async addTask(data) {
  if (this.isDataValid(data)) {
    // Generate a new task ID and add the new task.
    let newId = this.generateNewTaskId();
    this.addNewTask(newId, data);

    // Set a timeout to control the UI display.
    setTimeout(() => {
      this.boardService.showAddTask = false;
      this.boardService.showBoard = true;
    }, 2000);

    // Safely save the updated tasks and perform additional operations.
    await this.safeTasks();
    await this.findNearestDate(this.urgent);
    await this.resetAddTaskForm();
    await this.clearAssignedData();
    this.subtasks = [];
    await this.ngOnInit();
  }
}
  
/**
 * Check if the provided task data is valid, ensuring that the title, date, and category are not empty.
 *
 * @param {object} data - Data containing task details to be validated.
 * @returns {boolean} True if the data is valid, false otherwise.
 */
  isDataValid(data) {
  return data.title !== '' && data.date !== '' && data.category !== '';
}

/**
 * Generate a new task ID by finding the maximum existing task ID and incrementing it by one.
 *
 * @returns {number} The newly generated task ID.
 */
  generateNewTaskId() {
  /**
   * The maximum existing task ID within the "tasks" array.
   * @type {number}
   */
  let maxId = this.tasks.reduce((max, task) => (task.id > max ? task.id : max), 0);
  // Return the newly generated task ID by incrementing the maximum ID by one.
  return maxId + 1;
}

/**
 * Add a new task to the "tasks" array using the provided data and a newly generated task ID.
 *
 * @param {number} newId - The newly generated task ID.
 * @param {object} data - Data containing task details to be added.
 */
addNewTask(newId, data) {
  let selectedContacts = this.ArraysService.contacts
    .filter((contact) => contact.selected)
    .map((contact) => contact.name);

  // Create a new array for the subtasks of the current task
  let subtasksForCurrentTask = [];

  // Initialize a new subtask in the subtasks array with the name and completed as false
  subtasksForCurrentTask.push({ name: data.title, completed: false });

  // Initialize additional subtasks as needed
  if (data.subtask && data.subtask.length > 0) {
    for (let subtaskName of data.subtask) {
      subtasksForCurrentTask.push({ name: subtaskName, completed: false });
    }
  }

  // Add the subtasks array for the current task to the main subtasks array
  this.subtasks.push(...subtasksForCurrentTask);

  // Add the new task to the "tasks" array.
  this.pushToArray(
    newId,
    selectedContacts,
    data.title,
    data.description,
    data.date,
    this.selectedPriority,
    data.category,
    subtasksForCurrentTask, // Use the new array for subtasks
    this.assignStatus
  );

  // Add empty arrays for subtasksDone for the current task
  this.tasks[this.tasks.length - 1].subtasksDone = [];

  console.log('New task added successfully with subtasks.', this.subtasks);
}



/**
 * Asynchronous function to edit an existing task with the provided data.
 *
 * @param {object} data - Data containing updated task details.
 */
async editTask(data) {
  await this.getIndexOfSelectedTask();

  // Find the index in the main tasks array
  let taskIndex = this.selectedTaskIndex;


  if (this.isValidTaskIndex(taskIndex)) {
    this.updateTaskProperties(taskIndex, data);
    this.combineAndSetSubtasks(taskIndex);
    this.combineAndSetAssignedContacts(taskIndex, data.assignedContacts);
    this.safeTasks();
    this.postEditCleanup(data);
    this.newSubtasks = [];
  } else {
    console.log('Invalid task index.');
  }
}

/**
 * Check if the provided task index is valid.
 *
 * @param {number} taskIndex - The index of the selected task.
 * @returns {boolean} True if the index is valid, false otherwise.
 */
  isValidTaskIndex(taskIndex) {
  return taskIndex >= 0 && taskIndex < this.tasks.length;
}

/**
 * Update the task properties with the provided data.
 *
 * @param {number} taskIndex - The index of the task to update.
 * @param {object} data - Data containing updated task details.
 */
  updateTaskProperties(taskIndex, data) {
  let task = this.tasks[taskIndex];
  task.title = data.title;
  task.description = data.description;
  task.date = data.date;
  task.prio = this.selectedEditPriority;
  task.category = data.category;
}

// In der Methode combineAndSetSubtasks
combineAndSetSubtasks(taskIndex) {

  let existingSubtasks = this.tasks[this.selectedTaskIndex].subtasks || [];
  let combinedSubtasks = [...existingSubtasks, ...this.newSubtasks];
  this.tasks[taskIndex].subtasks = combinedSubtasks;

  console.log('Combined Subtasks:', combinedSubtasks);
}

/**
 * Combine and set assigned contacts for the selected task, ensuring uniqueness.
 *
 * @param {number} taskIndex - The index of the task to update.
 * @param {Array} assignedContacts - An array of newly assigned contacts.
 */
  combineAndSetAssignedContacts(taskIndex, assignedContacts) {
  let existingAssigned = this.tasks[taskIndex].assigned;
  let combinedAssigned = [...existingAssigned, ...assignedContacts];
  let uniqueCombinedAssigned = combinedAssigned.filter(
    (contact, index, self) => index === self.findIndex(c => c.id === contact.id)
  );
  this.tasks[taskIndex].assigned = uniqueCombinedAssigned;
}

/**
 * Perform cleanup and UI updates after editing a task.
 *
 * @param {object} data - Data containing updated task details.
 */
  postEditCleanup(data) {
  this.findNearestDate(this.urgent);
  this.subtasks = [];
  this.clearAssignedData();
  this.ngOnInit();
  data.assignedContacts = [];

  setTimeout(() => {
    // todo confirmationMessage(); hideSlider();
  }, 1000);
}

  removeDuplicates(array) {
    return array.filter((item, index, self) => {
      return self.findIndex((t) => t.id === item.id) === index;
    });
  }

  resetAddTaskForm() {
    this.addTaskForm.reset();
  }

  resetEditTaskForm() {
    this.editTaskForm.reset();
  }


  addSubtask() {
    let subtaskControl = this.addTaskForm.get('subtask');
    let subtaskValue = subtaskControl.value;
  
    if (subtaskValue) {
      // Hinzufügen eines Subtasks als Objekt
      this.subtasks.push({ name: subtaskValue, completed: false });
  
      subtaskControl.setValue(''); // Das Eingabefeld leeren
      console.log('New task added successfully with subtasks.', this.subtasks);
    }
  }

  addSubtaskFromEdit() {
    let subtaskControl = this.editTaskForm.get('subtask');
    let subtaskValue = subtaskControl.value;
  
    if (subtaskValue) {
      // Hinzufügen eines Subtasks als Objekt
      this.subtasks.push({ name: subtaskValue, completed: false });
  
      subtaskControl.setValue(''); // Das Eingabefeld leeren
    }
  }

  editSubtask() {
    let subtaskControl = this.editTaskForm.get('subtask');
    let subtaskValue = subtaskControl.value;

    if (subtaskValue) {
      this.subtasks.push(subtaskValue);
      subtaskControl.setValue(''); // Das Eingabefeld leeren
    }
  }

  deleteSubtask(i) {
    this.subtasks.splice(i, 1);
    this.pushFromTaskArraytoSubtaskArray();
  }

  deleteSubtaskFromEdit(i) {
    this.newSubtasks.splice(i, 1);
    this.safeTasks();
  }

  async updateTask(taskIndex: number, newStatus: string) {
    if (taskIndex >= 0 && taskIndex < this.tasks.length) {
      this.tasks[taskIndex].status = newStatus;
      await this.safeTasks();
      console.log(
        `Updated task status to "${newStatus}" for task with title: ${this.tasks[taskIndex].title}`
      );
    } else {
      console.error('Invalid task index');
    }
  }

  pushToArray(
    id,
    assigned,
    title,
    description,
    date,
    prio,
    category,
    subtasks,
    status,
  ) {
    this.tasks.push({
      id: id,
      assigned: this.assignedUser,
      title: title,
      description: description,
      date: date,
      prio: this.selectedPriority,
      category: category,
      subtasks: this.subtasks,
      status: this.assignStatus,
    });
  }

  selectAssigned(assigned: string) {
    this.selectedPriority = assigned;
  }

/**
 * Asynchronously sets the 'completed' status of a subtask and updates the tasks.
 *
 * @param {number} subtaskIndex - The index of the subtask to be updated.
 * @param {boolean} isChecked - The status indicating whether the subtask is completed.
 * @returns {Promise<void>} A promise that resolves after the subtask has been updated and the task is saved.
 * @throws {Error} Throws an error if the subtaskIndex is invalid or if no task is selected.
 *
 * @example
 * // Set the 'completed' status of a subtask to true
 * await setSubtaskCompleted(0, true);
 */
async setSubtaskCompleted(subtaskIndex: number, isChecked: boolean): Promise<void> {
  await this.getIndexOfSelectedTask();

  if (this.selectedTask && subtaskIndex >= 0) {
    let subtasksArray = this.selectedTask.subtasks;

    if (subtaskIndex < subtasksArray?.length) {
      let completedSubtask = subtasksArray[subtaskIndex];

      // Update subtask.completed based on isChecked
      completedSubtask.completed = isChecked;

      // Initialize subtasksDone array if not already present
      this.selectedTask.subtasksDone ??= [];

      if (isChecked) {
        // If isChecked is true, add the completed subtask to subtasksDone
        this.selectedTask.subtasksDone.push({ ...completedSubtask });
      } else {
        // If isChecked is false, remove the subtask from subtasksDone
        let subtasksDoneIndex = this.selectedTask.subtasksDone.findIndex(
          (subtask) => subtask.name === completedSubtask.name
        );
        if (subtasksDoneIndex !== -1) {
          this.selectedTask.subtasksDone.splice(subtasksDoneIndex, 1);
        }
      }

      // Update the subtasks array in the selected task
      this.selectedTask.subtasks = [...subtasksArray];

      // Update the subtasksDone array in the selected task
      this.selectedTask.subtasksDone = [...this.selectedTask.subtasksDone];

      // Update the tasks array
      this.tasks[this.selectedTaskIndex] = { ...this.selectedTask };

      console.log('Updated subtasks:', this.selectedTask.subtasks);
      console.log('Updated subtasksDone:', this.selectedTask.subtasksDone);
      console.log('Updated tasks:', this.tasks);

      // Save the updated tasks
      await this.safeTasks();

      console.log('Tasks saved successfully.');
    } else {
      console.error('Invalid subtaskIndex or selected task');
    }
  } else {
    throw new Error('Invalid subtaskIndex or no task selected');
  }
}



/**
 * Moves a subtask from a source array to a destination array at the specified index.
 *
 * @param {any[]} sourceArray - The array from which the subtask will be moved.
 * @param {any[]} destinationArray - The array to which the subtask will be moved.
 * @param {number} subtaskIndex - The index of the subtask to be moved.
 * @returns {void} Returns nothing.
 *
 * @example
 * // Move a subtask from 'subtasks' to 'subtasksDone'
 * moveSubtask(this.selectedTask.subtasks, this.selectedTask.subtasksDone, 0);
 *
 * // Move a subtask from 'subtasksDone' to 'subtasks'
 * moveSubtask(this.selectedTask.subtasksDone, this.selectedTask.subtasks, 1);
 */
private moveSubtask(sourceArray: any[], destinationArray: any[], subtaskIndex: number): void {
  let completedSubtask = sourceArray.splice(subtaskIndex, 1)[0];

  destinationArray ??= [];
  destinationArray.push(completedSubtask);
}

/**
 * Deletes a subtask from the 'subtasksDone' array at the specified index.
 *
 * @param {number} subtaskIndex - The index of the subtask to be deleted.
 * @returns {void} Returns nothing.
 * @throws {Error} Throws an error if the subtaskIndex is invalid, or if no task is selected.
 *
 * @example
 * // Delete a subtask from 'subtasksDone' at index 0
 * deleteSubtaskDone(0);
 */
deleteSubtaskDone(subtaskIndex: number): void {
  if (this.selectedTask && subtaskIndex >= 0 && this.selectedTask.subtasksDone) {
    if (subtaskIndex < this.selectedTask.subtasksDone.length) {
      this.selectedTask.subtasksDone.splice(subtaskIndex, 1);
      this.safeTasks(); // Save the changes
      console.log('Subtask deleted successfully.');
    } else {
      console.error('Invalid subtaskIndex for subtasksDone or selected task');
    }
  }
}

  /**
   * Asynchronous function to store tasks according status in subarrays.
   * @type {Array}
   */
  async mapTaskStatus() {
    this.toDo = this.tasks.filter((task) => task.status === 'toDo');
    this.inProgress = this.tasks.filter((task) => task.status === 'inProgress');
    this.awaitFeedback = this.tasks.filter(
      (task) => task.status === 'awaitFeedback'
    );
    this.done = this.tasks.filter((task) => task.status === 'done');
  }

  /**
   * Asynchronous function to store tasks according status in subarrays.
   * @type {Array}
   */
  async mapUrgentTasks() {
    this.urgent = this.tasks.filter((task) => task.prio === 'urgent');
  }
 /**
 * Finds the nearest date among the specified tasks and sets the result to nearestUrgentTaskDate.
 *
 * @param {Array} tasks - The array of tasks to search for the nearest date.
 * @returns {Promise<void>} A promise that resolves after finding the nearest date.
 *
 * @example
 * // Find the nearest date among all tasks
 * await findNearestDate(allTasksArray);
 */
async findNearestDate(tasks: any[]): Promise<void> {
  if (!tasks || tasks.length === 0) {
    this.nearestTaskDate = null;
    return;
  }

  let today = new Date();
  let nearestDate = new Date(tasks[0].date);

  for (let task of tasks) {
    let taskDate = new Date(task.date);
    let timeDifference = Math.abs(taskDate.getTime() - today.getTime());

    if (timeDifference < Math.abs(nearestDate.getTime() - today.getTime())) {
      nearestDate = taskDate;
    }
  }

  let options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  let formattedDate = nearestDate.toLocaleDateString('en-US', options); // 'en-US' for English

  this.nearestTaskDate = formattedDate;
  console.log('Nearest task date:', this.nearestTaskDate);
}



  async getNewStatus (status: string) {
    this.assignStatus = status;
  }
  
  deleteAssignedFromTask(i,j) {
    this.tasks[i].assigned.splice(j, 1);
    this.safeTasks();
  }

  clearAddtaskForm() {
    console.log('clearAddtaskForm');
    this.addTaskForm.get('title').setValue('');
    this.addTaskForm.get('description').setValue('');
    this.addTaskForm.get('date').setValue('');
    this.addTaskForm.get('category').setValue('');
    this.addTaskForm.get('subtask').setValue('');
    this.addTaskForm.get('title').markAsUntouched();
    this.addTaskForm.get('description').markAsUntouched();
    this.addTaskForm.get('date').markAsUntouched();
    this.addTaskForm.get('category').markAsUntouched();
  }

  /**
   * Asynchronous function to save all tasks from array "contacts" to remote storage
   */
  async safeTasks() {
    await this.RemotestorageService.setItem(
      'tasks_array',
      JSON.stringify(this.tasks)
    );
  }
  /**
   * Asynchronous function to load all tasks from the remote storage and assign them to the "tasks" array
   */
  async loadTasks() {
    this.tasks = JSON.parse(
      await this.RemotestorageService.getItem('tasks_array')
    );
  }
}
