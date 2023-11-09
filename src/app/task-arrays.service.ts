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

  public addTaskForm: FormGroup = new FormGroup({
    title: new FormControl('', [Validators.required]),
    description: new FormControl('', []),
    date: new FormControl('', [Validators.required]),
    category: new FormControl('', [Validators.required]),
    subtask: new FormControl('', []),
    assignedContacts: this.fb.array([]),
  });

  public editTaskForm: FormGroup = new FormGroup({
    title: new FormControl('', [Validators.required]),
    description: new FormControl('', []),
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
      title: new FormControl('', [Validators.required]),
      description: new FormControl('', []),
      date: new FormControl('', [Validators.required]),
      category: new FormControl('', [Validators.required]),
      subtask: new FormControl('', []),
      assignedContacts: this.fb.array([]),
    });
    this.addTaskForm.valueChanges.subscribe(console.log);

    this.editTaskFormFB = this.fb.group({
      title: new FormControl('', [Validators.required]),
      description: new FormControl('', []),
      date: new FormControl('', [Validators.required]),
      category: new FormControl('', [Validators.required]),
      subtask: new FormControl('', []),
      assignedContacts: this.fb.array([]),
    });
    this.editTaskForm.valueChanges.subscribe(console.log);

    const currentDate = new Date();
    this.minDate = currentDate.toISOString().split('T')[0];
  }

  minDate: string;
  selectedPriority: string = '';
  assignedDropdownVisible: boolean = false;
  taskId: number = 0;
  nearestUrgendTaskDate: any = '';
  selectedTask: any;
  selectedTaskIndex: number;

  ngOnInit() {
    this.loadTasks();
    this.generateTaskId();
    this.editTaskForm.patchValue(this.selectedTask);
  }

  /**
   * An array to store tasks.
   * @type {Array}
   */
  tasks = [];

  /**
   * An array to filtered store tasks.
   * @type {Array}
   */
  filteredTasks = [];
  filteredToDo = [];
  filteredInProgress = [];
  filteredAwaitFeedback = [];
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
  subtasks = [];

  assignedUser = [];

  assignStatus: string ;


  pushToAssignedArray(contactName: string) {
    const assignedContacts = this.addTaskForm.get('assignedContacts') as FormArray;
  
    // Check if the contact is already in the array
    const index = assignedContacts.value.indexOf(contactName);
  
    if (index === -1) {
      // Contact is not in the array, so add it to the form control
      assignedContacts.push(this.fb.control(contactName));
  
      // Push the contact to the local array
      this.assignedUser.push(contactName);
    } else {
      // Contact is already in the array, so remove it from the form control
      assignedContacts.removeAt(index);
  
      // Remove the contact from the local array
      this.assignedUser.splice(index, 1);
    }
  }

  removeFromAssignedArray(index: number) {
    let assignedContacts = this.addTaskForm.get('assignedContacts') as FormArray;
    assignedContacts.removeAt(index);
  }

  clearAssignedData() {
    this.assignedUser = []; // Clear the local assignedUser array
  
    const assignedContacts = this.addTaskForm.get('assignedContacts') as FormArray;
    assignedContacts.clear(); // Clear the FormArray
  }

  pushFromTaskArraytoSubtaskArray() {
    console.log('selectedTask', this.selectedTaskIndex);
    let subtask = this.tasks[this.selectedTaskIndex].subtask;
    if (subtask) {
      this.subtasks.push(...subtask);
      console.log('subtasks', this.subtasks);
    }
  }

  getIndexOfSelectedTask() {
    let index = this.tasks.findIndex(task => task.id === this.selectedTask.id);
    this.selectedTaskIndex = index;
  }

  async generateTaskId() {
    // first filter out IDs from the "task" array and convert them to numbers (from strings)
    let taskIds = this.tasks.length;

    // if taskarray is empty, set the ID to 1
    if (this.tasks.length === 0) {
      this.taskId = 1;
    }

    console.log('Task-ArrayService generated task id', this.taskId);
  }
  /**
   * Asynchronous function to add a new task to the "task" array
   */
  async addTask(data) {

    let status = this.assignStatus;

    let maxId = 0;
    this.tasks.forEach((contact) => {
      if (contact.id > maxId) {
        maxId = contact.id;
      }
    });

    // find max id in contacts array + 1
    let newId = maxId + 1;

    this.taskId = newId;

    if (data.title != '' && data.date != '' && data.category != '') {
      let selectedContacts = this.ArraysService.contacts
        .filter((contact) => contact.selected)
        .map((contact) => contact.name);

      this.pushToArray(
        this.taskId,
        data.title,
        data.description,
        data.date,
        data.assignedContacts,
        data.category,
        this.subtasks,
        status
      );
      await this.safeTasks();
      console.log(
        'Added task',
        this.taskId,
        data.title,
        data.description,
        data.date,
        data.assignedContacts,
        data.category,
        data.subtask
      );
    }
    await this.findNearestDate(this.urgent);
    await this.resetAddTaskForm();
    this.assignStatus = '';
    this.subtasks = [];
    this.clearAssignedData();
    this.ngOnInit();

    setInterval(() => {
      this.boardService.showAddTask = false;
      this.boardService.showBoard = true;
    }, 1000);
    //TODO confimationMessage();
  }



  /**
   * Asynchronous function to add a new task to the "task" array
   */
  async editTask(data) {
    // Find the index in the main tasks array
    let taskIndex = this.selectedTaskIndex ;
  
    if (taskIndex >= 0 && taskIndex < this.tasks.length) {
      console.log('Edited task', data.title, data.description, data.dueDate, data.assignedContacts, data.category, data.subtask);
  
      // Update the task properties
      this.tasks[taskIndex].title = data.title;
      this.tasks[taskIndex].description = data.description;
      this.tasks[taskIndex].date = data.date;
      this.tasks[taskIndex].assigned = this.assignedUser;
      this.tasks[taskIndex].prio = this.selectedPriority;
      this.tasks[taskIndex].category = data.category;
  
      // Push each entry from data.subtask into this.tasks[taskIndex].subtask
      for (let subtask of data.subtask) {
        this.tasks[taskIndex].subtask.push(subtask);
      }
  
      // Push each entry from this.subtasks into this.tasks[taskIndex].subtask
      for (let subtask of this.subtasks) {
        this.tasks[taskIndex].subtask.push(subtask);
      }
  
      this.safeTasks();
  
      console.log('Edited task', data.title, data.description, data.dueDate);
    } else {
      console.log('Invalid task index.');
    }
  
    await this.findNearestDate(this.urgent);
    this.subtasks = [];
    this.clearAssignedData();
    this.ngOnInit();
  
    // todo confirmationMessage(); hideSlider();
  }

  resetAddTaskForm() {
    this.addTaskForm.reset();
  }


  addSubtask() {
    let subtaskControl = this.addTaskForm.get('subtask');
    let subtaskValue = subtaskControl.value;

    if (subtaskValue) {
      this.subtasks.push(subtaskValue);
      subtaskControl.setValue(''); // Das Eingabefeld leeren
    }

    console.log('subtasks', this.subtasks);
  }

  addSubtaskFromEdit() {
    let subtaskControl = this.editTaskForm.get('subtask');
    let subtaskValue = subtaskControl.value;

    if (subtaskValue) {
      this.subtasks.push(subtaskValue);
      subtaskControl.setValue(''); // Das Eingabefeld leeren
    }

    console.log('addSubtaskFromEdit generated subtasks', this.subtasks);
  }

  editSubtask() {
    let subtaskControl = this.editTaskForm.get('subtask');
    let subtaskValue = subtaskControl.value;

    if (subtaskValue) {
      this.subtasks.push(subtaskValue);
      subtaskControl.setValue(''); // Das Eingabefeld leeren
    }

    console.log('subtasks', this.subtasks);
  }

  deleteSubtask(i) {
    this.subtasks.splice(i, 1);
    this.pushFromTaskArraytoSubtaskArray();
  }

  deleteSubtaskFromEdit(i) {
    console.log('deleteSubtaskFromEdit aktive index to delete:', this.selectedTaskIndex);
    this.tasks[this.selectedTaskIndex].subtask.splice(i, 1);
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
    title,
    description,
    date,
    assigned,
    category,
    subtask,
    status
  ) {
    this.tasks.push({
      id: this.taskId,
      title: title,
      description: description,
      date: date,
      prio: this.selectedPriority,
      assigned: assigned,
      category: category,
      subtask: subtask,
      status: status,
    });
  }

  selectAssigned(assigned: string) {
    this.selectedPriority = assigned;
    console.log(this.selectedPriority);
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
   *  function to filter tasks with prio = urgent and return the nearest date.
   * @type {Array}
   */
  async findNearestDate(urgentArray: any[]): Promise<void> {
    if (!urgentArray || urgentArray.length === 0) {
      this.nearestUrgendTaskDate = null;
      return;
    }

    let today = new Date();
    let nearestDate = new Date(urgentArray[0].date);

    for (let item of urgentArray) {
      let itemDate = new Date(item.date);
      let timeDifference = Math.abs(itemDate.getTime() - today.getTime());

      if (timeDifference < Math.abs(nearestDate.getTime() - today.getTime())) {
        nearestDate = itemDate;
      }
    }

    let options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    let formattedDate = nearestDate.toLocaleDateString('en-US', options); // 'en-US' for English

    this.nearestUrgendTaskDate = formattedDate;
  }


  async getNewStatus (status: string) {
    this.assignStatus = status;
    console.log(
      'this.TaskArrayService.assignStatus',
      this.assignStatus
    );
  }


  /**
   * Asynchronous function to save all tasks from array "contacts" to remote storage
   */
  async safeTasks() {
    await this.RemotestorageService.setItem(
      'tasks_array',
      JSON.stringify(this.tasks)
    );
    console.log('Task-ArrayService Saved task', this.tasks);
  }
  /**
   * Asynchronous function to load all tasks from the remote storage and assign them to the "tasks" array
   */
  async loadTasks() {
    this.tasks = JSON.parse(
      await this.RemotestorageService.getItem('tasks_array')
    );
    console.log('Task-ArrayService loaded task', this.tasks);
  }
}
