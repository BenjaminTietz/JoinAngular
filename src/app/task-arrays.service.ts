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
    this.subtasks = [];
  }

  minDate: string;
  selectedPriority: string = '';
  selectedEditPriority: string = '';
  assignedDropdownVisible: boolean = false;
  taskId: number = 0;
  nearestUrgendTaskDate: any = '';
  selectedTask: any;
  selectedTaskIndex: number;

  async ngOnInit() {
    await this.loadTasks();
    await this.ArraysService.loadContacts(); 
    this.ArraysService.contacts.forEach(contact => {
        contact.selected = false;
      });
    await this.generateTaskId();
    this.editTaskForm.patchValue(this.selectedTask);
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
   * An array to store string of status of the Task which gets added e.g('toDo,inProgress,awaitingFeedback') .
   * @type {Array}
   */
  assignStatus: string ;


  pushToAssignedArray(contact: any) {
    let assignedContacts = this.addTaskForm.get('assignedContacts') as FormArray;
  
    // Check if the contact is already in the array
    let index = assignedContacts.value.findIndex(c => c.id === contact.id);
  
    if (index === -1) {
      // Contact is not in the array, so add it to the form control
      assignedContacts.push(this.fb.control(contact));
  
      // Push the contact to the local array
      this.assignedUser.push(contact);
      console.log('new assigned contact is:', contact)
    } else {
      // Contact is already in the array, so remove it from the form control
      assignedContacts.removeAt(index);
  
      // Remove the contact from the local array
      this.assignedUser.splice(index, 1);
    }
  }

  pushToAssignedArrayFromEdit(contact: any) {
    let assignedContacts = this.editTaskForm.get('assignedContacts') as FormArray;
  
    // Get the IDs of the contacts in assignedContacts
    const assignedContactIds = assignedContacts.value.map((c) => c.id);
  
    // Check if the contact is already in tasks[i].assigned
    if (this.selectedTask) {
      const isContactAlreadyAssigned = this.selectedTask.assigned.some((assignedContact) =>
        assignedContactIds.includes(assignedContact.id)
      );
  
      if (isContactAlreadyAssigned) {
        console.log('Contact is already assigned to the task.');
        return; // Exit early, do not add the contact again
      }
    }
  
    // Check if the contact is already in the array
    let index = assignedContacts.value.findIndex(c => c.id === contact.id);
  
    if (index === -1) {
      // Contact is not in the array, so add it to the form control
      assignedContacts.push(this.fb.control(contact));
  
      // Push the contact to the local array
      this.assignedUser.push(contact);
      console.log('New assigned contact is:', contact);
    } else {
      // Contact is already in the array, so remove it from the form control
      assignedContacts.removeAt(index);
  
      // Remove the contact from the local array
      this.assignedUser.splice(index, 1);
      console.log('Removed assigned contact:', contact);
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

    if (this.isDataValid(data)) {
      let newId = this.generateNewTaskId();
      this.addNewTask(newId, data);


  
      setTimeout(() => {

        this.boardService.showAddTask = false;
        this.boardService.showBoard = true;
      }, 2000);
      await this.safeTasks();
      await this.findNearestDate(this.urgent);
      await this.resetAddTaskForm();
      await this.clearAssignedData();
      await this.ngOnInit();

    }
  }
  
  isDataValid(data) {
    return data.title !== '' && data.date !== '' && data.category !== '' && data.assignedContacts.length > 0 ;
  }
  
  generateNewTaskId() {
    let maxId = this.tasks.reduce((max, task) => (task.id > max ? task.id : max), 0);
    return maxId + 1;
  }
  
  addNewTask(newId, data) {
    let selectedContacts = this.ArraysService.contacts
      .filter((contact) => contact.selected)
      .map((contact) => contact.name);
  
this.pushToArray(newId, data.assignedContacts, data.title, data.description, data.date, this.selectedPriority, data.category, this.subtasks, this.assignStatus)
    console.log('Added task', newId, data.title, data.description, data.date, data.assignedContacts, data.category, data.subtask);
  }
  



  /**
   * Asynchronous function to add a new task to the "task" array
   */
//   async editTask(data) {
//     let taskIndex = this.selectedTaskIndex;

//     if (taskIndex >= 0 && taskIndex < this.tasks.length) {
//         // ...

        // // Setzen Sie this.selectedPriority basierend auf der ausgewählten Priorität
        // if (this.selectedPriority === 'urgent') {
        //     this.selectedPriority = 'urgent';
        // } else if (this.selectedPriority === 'medium') {
        //     this.selectedPriority = 'medium';
        // } else if (this.selectedPriority === 'low') {
        //     this.selectedPriority = 'low';
        // }

//         // ...

//         this.safeTasks();

//         console.log('Edited task', data.title, data.description, data.dueDate);
//         this.selectedTask.assigned.data = [];
//     } else {
//         console.log('Invalid task index.');
//     }

//     await this.findNearestDate(this.urgent);
//     this.assignStatus = '';
//     this.subtasks = [];
//     this.clearAssignedData();
//     this.ngOnInit();

//     setTimeout(() => {
//         // todo confirmationMessage(); hideSlider();
//     }, 1000);
// }
async editTask(data) {
  await this.getIndexOfSelectedTask();
  // Find the index in the main tasks array
  let taskIndex = this.selectedTaskIndex;

  if (taskIndex >= 0 && taskIndex < this.tasks.length) {
    console.log('Edited task', data.title, data.description, data.dueDate, data.prio, data.assignedContacts, data.category, data.subtask);


  

    // Update the task properties
    this.tasks[taskIndex].title.push(data.title);
    this.tasks[taskIndex].description.push(data.description);
    this.tasks[taskIndex].date.push(data.date);
    this.tasks[taskIndex].prio.push(this.selectedEditPriority);
    console.log('this.selectedPriority', this.selectedEditPriority);
    this.tasks[taskIndex].category.push(data.title);
    this.tasks[taskIndex].subtasks.push(this.subtasks);
    this.tasks[taskIndex].subtasksDone.push(this.subtasksDone);
    this.tasks[taskIndex].assigned.push(this.assignedUser);
    this.tasks[taskIndex].status.push(this.assignStatus);


    // Push each entry from data.subtask into this.tasks[taskIndex].subtask
    for (let subtaskName of data.subtask) {
      this.tasks[taskIndex].subtasks.push({ name: subtaskName, completed: false });
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
  await this.resetEditTaskForm();

  setTimeout(() => {
    // todo confirmationMessage(); hideSlider();
  }, 1000);
  // todo confirmationMessage(); hideSlider();
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
  //this.pushToArray(newId, data.assignedContacts, data.title, data.description, data.date, this.selectedPriority, data.category, this.subtasks, this.assignStatus);
  
  pushToArray(
    id,
    assigned,
    title,
    description,
    date,
    prio,
    category,
    subtask,
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
      subtask: subtask,
      status: status,
    });
  }

  selectAssigned(assigned: string) {
    this.selectedPriority = assigned;
    console.log(this.selectedPriority);
  }

// TODO updateSubtaskStatus
async updateSubtaskStatus(subtaskIndex: number) {
  await this.getIndexOfSelectedTask();

  if (this.selectedTask && subtaskIndex >= 0) {
    if (this.selectedTask.subtask && subtaskIndex < this.selectedTask.subtask.length) {
      // Verschiebe den Subtask von subtask zu subtasksDone
      const completedSubtask = this.selectedTask.subtask.splice(subtaskIndex, 1)[0];

      if (!this.selectedTask.subtasksDone) {
        this.selectedTask.subtasksDone = []; // Initialisiere subtasksDone, falls es noch nicht existiert
      }

      this.selectedTask.subtasksDone.push(completedSubtask);
    } else if (this.selectedTask.subtasksDone && subtaskIndex < this.selectedTask.subtasksDone.length) {
      // Verschiebe den Subtask von subtasksDone zu subtask
      const completedSubtask = this.selectedTask.subtasksDone.splice(subtaskIndex, 1)[0];

      if (!this.selectedTask.subtask) {
        this.selectedTask.subtask = []; // Initialisiere subtask, falls es noch nicht existiert
      }

      this.selectedTask.subtask.push(completedSubtask);
    } else {
      console.error('Ungültiger subtaskIndex oder ausgewählter Task');
    }

    // Nachdem die Änderungen durchgeführt wurden, speichern Sie die Aufgaben
    await this.safeTasks();
  }
}

deleteSubtaskDone(subtaskIndex: number) {
  if (this.selectedTask && subtaskIndex >= 0 && this.selectedTask.subtasksDone) {
    if (subtaskIndex < this.selectedTask.subtasksDone.length) {
      this.selectedTask.subtasksDone.splice(subtaskIndex, 1);
      this.safeTasks(); // Speichern Sie die Änderungen
    } else {
      console.error('Ungültiger subtaskIndex für subtasksDone oder ausgewählter Task');
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
  
  deleteAssignedFromTask(i,j) {
    this.tasks[i].assigned.splice(j, 1);
    this.safeTasks();
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
