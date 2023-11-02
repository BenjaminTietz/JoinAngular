import { Injectable, OnInit } from '@angular/core';
import { RemotestorageService } from './remotestorage.service';

@Injectable({
  providedIn: 'root',
})
export class TaskArraysService {
  constructor(public RemotestorageService: RemotestorageService) {}

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
   * Asynchronous function to store tasks according status in subarrays.
   * @type {Array}
   */
  async updateTaskStatus() {
    this.toDo = this.tasks.filter((task) => task.status === 'toDo');
    this.inProgress = this.tasks.filter((task) => task.status === 'inProgress');
    this.awaitFeedback = this.tasks.filter(
      (task) => task.status === 'awaitFeedback'
    );
    this.done = this.tasks.filter((task) => task.status === 'done');
    console.log('toDo', this.toDo);
    console.log('inProgress', this.inProgress);
    console.log('awaitFeedback', this.awaitFeedback);
    console.log('done', this.done);
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
