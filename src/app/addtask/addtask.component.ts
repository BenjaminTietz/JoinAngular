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
  @ViewChild('prioUrgent') prioUrgent: ElementRef;
  @ViewChild('prioMedium') prioMedium: ElementRef;
  @ViewChild('prioLow') prioLow: ElementRef;
  @ViewChild('popupCreatedContainer') popupCreatedContainer: ElementRef;
  @ViewChild('popupdeletedContainer') popupdeletedContainer: ElementRef;


  form: FormGroup;

  constructor(
    private router: Router,
    public RemotestorageService: RemotestorageService,
    public TaskArraysService: TaskArraysService,
    public ArraysService: ArraysService,
    public fb: FormBuilder,
  ) {}

  async ngOninit() {
    await this.TaskArraysService.loadTasks();
    await this.ArraysService.loadContacts();

    
    this.ArraysService.contacts.forEach(contact => {
        contact.selected = false;
      });
  }


  selectPriority(priority: string) {
    this.TaskArraysService.selectedPriority = priority;
    console.log(this.TaskArraysService.selectedPriority);

    if (this.TaskArraysService.selectedPriority === 'urgent')
    {
      this.prioUrgent.nativeElement.classList.toggle('assign-color-urgent');
      this.prioMedium.nativeElement.classList.remove('assign-color-medium');
      this.prioLow.nativeElement.classList.remove('assign-color-low');
    } 
    else if (this.TaskArraysService.selectedPriority === 'medium') 
    {
      this.prioMedium.nativeElement.classList.toggle('assign-color-medium');
      this.prioUrgent.nativeElement.classList.remove('assign-color-urgent');
      this.prioLow.nativeElement.classList.remove('assign-color-low');
    } 
    else if (this.TaskArraysService.selectedPriority === 'low') 
    {
      this.prioLow.nativeElement.classList.toggle('assign-color-low');
      this.prioUrgent.nativeElement.classList.remove('assign-color-urgent');
      this.prioMedium.nativeElement.classList.remove('assign-color-medium');
    }
  }


  showAssignDropdown() {
    this.assignedDropdown.nativeElement.classList.toggle(
      'show-assigned-dropdown'
    );
    if (this.TaskArraysService.assignedDropdownVisible == false) {
      this.TaskArraysService.assignedDropdownVisible = true;
    } else {
      this.TaskArraysService.assignedDropdownVisible = false;
    }
  }

  showSuccessMessage() {

      this.popupCreatedContainer.nativeElement.classList.add('showPopup');
    setTimeout(() => {
      this.popupCreatedContainer.nativeElement.classList.remove('showPopup');
    }, 3000);
  }

}



