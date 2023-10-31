import {
  Component,
  ViewChild,
  ElementRef,
  NgModule,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { RemotestorageService } from '../remotestorage.service';
import { TaskArraysService } from '../task-arrays.service';


@Component({
  selector: 'app-addtask',
  templateUrl: './addtask.component.html',
  styleUrls: ['./addtask.component.scss']
})
export class AddtaskComponent {
  @ViewChild('inputName') inputName: ElementRef;
  @ViewChild('inputEmail') inputEmail: ElementRef;
  @ViewChild('inputPhone') inputPhone: ElementRef;
  @ViewChild('addContactContainer') addContactContainer: ElementRef;
  @ViewChild('editContactContainer') editContactContainer: ElementRef;
  constructor(
    private router: Router,
    public RemotestorageService: RemotestorageService,
    public TaskArraysService: TaskArraysService
  ) {}

  /**
   * Asynchronous function to add a new task to the "task" array
   */
  async addTask(data) {
    console.log('Added task', data.title, data.description, data.date, data.assigned, data.category, data.subtask );
      if (data.title != '' && data.date != '' && data.category != '') {
          this.pushToArray(data.title, data.description, data.date, data.assigned, data.category, data.subtask);
          await this.TaskArraysService.safeTasks();
    // TODO    createdContactSuccessfully();
    //     hideAddContactCard();
    }
    // document.getElementById('form_add_contact').reset();
    //   await this.resetForm(data);
        //TODO confimationMessage();
  }

  pushToArray(title, description, date, assigned, category, subtask) {
    this.TaskArraysService.tasks.push({
      title: title,
      description: description,
      date: date,
      assigned: assigned,
      category: category,
      subtask: subtask,
    });
  }
}



