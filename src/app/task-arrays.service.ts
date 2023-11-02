import { Injectable, OnInit, ViewChild, ElementRef } from '@angular/core';
import { RemotestorageService } from './remotestorage.service';
import { ArraysService } from './contact-arrays.service';
import { AddtaskComponent } from './addtask/addtask.component';

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
  constructor(
    public RemotestorageService: RemotestorageService,
    public ArraysService: ArraysService
  ) {}

  selectedPriority: string = '';
  assignedDropdownVisible: boolean = false;

  ngOnInit() {
    this.loadTasks();
  }

  /**
   * An array to store tasks.
   * @type {Array}
   */
  tasks = [];
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
   * Asynchronous function to add a new task to the "task" array
   */
  async addTask(data) {
    let status = 'toDo';
    if (data.title != '' && data.date != '' && data.category != '') {
      let selectedContacts = this.ArraysService.contacts
        .filter((contact) => contact.selected)
        .map((contact) => contact.name);

      this.pushToArray(
        data.title,
        data.description,
        data.date,
        selectedContacts,
        data.category,
        data.subtask,
        status
      );
      await this.safeTasks();
      console.log(
        'Added task',
        data.title,
        data.description,
        data.date,
        selectedContacts,
        data.category,
        data.subtask
      );
      // TODO    createdContactSuccessfully();
      //     hideAddContactCard();
    }
    // document.getElementById('form_add_contact').reset();
    //   await this.resetForm(data);
    //TODO confimationMessage();
  }

  async updateTask(taskIndex: number, newStatus: string) {
    if (taskIndex >= 0 && taskIndex < this.tasks.length) {
      this.tasks[taskIndex].status = newStatus;
      await this.safeTasks();
      console.log(`Updated task status to "${newStatus}" for task with title: ${this.tasks[taskIndex].title}`);
    } else {
      console.error('Invalid task index');
    }
  }

  pushToArray(title, description, date, assigned, category, subtask, status) {
    this.tasks.push({
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
  selectPriority(priority: string) {
    this.selectedPriority = priority;
    console.log(this.selectedPriority);
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
