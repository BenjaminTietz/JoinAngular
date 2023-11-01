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
import { ArraysService } from '../contact-arrays.service';


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
  @ViewChild('assignedDropdown') assignedDropdown: ElementRef;
  selectedPriority: string = '';
  assignedDropdownVisible: boolean = false;

  constructor(
    private router: Router,
    public RemotestorageService: RemotestorageService,
    public TaskArraysService: TaskArraysService,
    public ArraysService: ArraysService
  ) {}

  async ngOninit() {
    await this.TaskArraysService.loadTasks();
    await this.ArraysService.loadContacts();

    
    this.ArraysService.contacts.forEach(contact => {
        contact.selected = false;
      });
  }

  /**
   * Asynchronous function to add a new task to the "task" array
   */
  async addTask(data) {
    let status = 'toDo';
    if (data.title != '' && data.date != '' && data.category != '') {
        let selectedContacts = this.ArraysService.contacts
            .filter(contact => contact.selected)
            .map(contact => contact.name);

        this.pushToArray(data.title, data.description, data.date, selectedContacts, data.category, data.subtask, status);
        await this.TaskArraysService.safeTasks();
        console.log('Added task', data.title, data.description, data.date, selectedContacts, data.category, data.subtask);
    // TODO    createdContactSuccessfully();
    //     hideAddContactCard();
    }
    // document.getElementById('form_add_contact').reset();
    //   await this.resetForm(data);
        //TODO confimationMessage();
  }

  pushToArray(title, description, date, assigned, category, subtask, status) {
    this.TaskArraysService.tasks.push({
      title: title,
      description: description,
      date: date,
      prio: this.selectedPriority,
      assigned: assigned,
      category: category,
      subtask: subtask,
      status: status
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

  showAssignDropdown() {
    this.assignedDropdown.nativeElement.classList.toggle('show-assigned-dropdown');
    if (this.assignedDropdownVisible == false) {
      this.assignedDropdownVisible = true;
    } else {
      this.assignedDropdownVisible = false;
    }
  }
}



