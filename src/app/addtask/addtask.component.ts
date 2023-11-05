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
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-addtask',
  templateUrl: './addtask.component.html',
  styleUrls: ['./addtask.component.scss']
})
export class AddtaskComponent {
  @ViewChild('assignedDropdown') assignedDropdown: ElementRef;
  @ViewChild('inputName') inputName: ElementRef;
  @ViewChild('inputEmail') inputEmail: ElementRef;
  @ViewChild('inputPhone') inputPhone: ElementRef;
  @ViewChild('addContactContainer') addContactContainer: ElementRef;
  @ViewChild('editContactContainer') editContactContainer: ElementRef;

  form: FormGroup;

  constructor(
    private router: Router,
    public RemotestorageService: RemotestorageService,
    public TaskArraysService: TaskArraysService,
    public ArraysService: ArraysService,
    private fb: FormBuilder,
  ) {}

  async ngOninit() {
    await this.TaskArraysService.loadTasks();
    await this.ArraysService.loadContacts();

    
    this.ArraysService.contacts.forEach(contact => {
        contact.selected = false;
      });
  }

  showAssignDropdown() {
    this.assignedDropdown.nativeElement.classList.toggle(
      'show-assigned-dropdown-container'
    );
    if (this.TaskArraysService.assignedDropdownVisible == false) {
      this.TaskArraysService.assignedDropdownVisible = true;
    } else {
      this.TaskArraysService.assignedDropdownVisible = false;
    }
  }
}



