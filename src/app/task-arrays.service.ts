import { Injectable, OnInit } from '@angular/core';
import { RemotestorageService } from './remotestorage.service';

@Injectable({
  providedIn: 'root'
})
export class TaskArraysService {

  constructor(public RemotestorageService: RemotestorageService) { }

  ngOnInit() {
    this.loadTasks();
  }

  /**
 * An array to store tasks.
 * @type {Array}
 */
  tasks = [];


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
