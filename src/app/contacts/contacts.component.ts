import {
  Component,
  ViewChild,
  ElementRef,
  NgModule,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { RemotestorageService } from '../remotestorage.service';
import { ArraysService } from '../arrays.service';
@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss'],
})
export class ContactsComponent {
  @ViewChild('inputName') inputName: ElementRef;
  @ViewChild('inputEmail') inputEmail: ElementRef;
  @ViewChild('inputPhone') inputPhone: ElementRef;
  @ViewChild('addContactContainer') addContactContainer: ElementRef;
  @ViewChild('editContactContainer') editContactContainer: ElementRef;

  selectedContactIndex: number = -1; // Initialisieren mit -1, um kein Element anzuzeigen
  selectedContact: ArraysService['contacts'][number] | null;
  ammountOfDisplayedcontacts: number = 0;

  userCircleColors: string[] = [
    '#FF7A00',
    '#FF5EB3',
    '#6E52FF',
    '#9327FF',
    '#00BEE8',
    '#1FD7C1',
    '#FF745E',
    '#FFA35E',
    '#FC71FF',
    '#FFC701',
    '#0038FF',
    '#C3FF2B',
    '#FFE62B',
    '#FF4646',
    '#FFBB2B'
  ];
  constructor(
    private router: Router,
    public RemotestorageService: RemotestorageService,
    public ArraysService: ArraysService
  ) {}

  async ngOnInit() {
    await this.ArraysService.loadContacts()
    this.ammountOfDisplayedcontacts = this.ArraysService.contacts.length;
    console.log('ammountOfDisplayedcontacts',this.ammountOfDisplayedcontacts);
  }
  /**
   * Function to push the entered contacts into the "contacts" array
   * @param {string} name - This is the name of an existing contact
   * @param {string} email - This is the email of an existing contact
   * @param {number} phone - This is the phone number of an existing contact
   * @param {string} color - - This is the color which gets assigned to an existing contact
   */
  pushToArray(name, email, phone) {
    let color = this.getRandomUserCircleColor();
    this.ArraysService.contacts.push({
      name: name,
      email: email,
      phone: phone,
      color: color
    });
    this.ArraysService.safeContacts();
  }

  /**
   * Asynchronous function to add a new contact to the "contacts" array
   */
  async addContact(data) {
    console.log('Added contact',data.name, data.email, data.phone);
    this.ArraysService.sortedalphabetically = [];
    if (data.name != '' && data.email != '' && data.phone != '') {
        this.pushToArray(data.name, data.email, data.phone);
        await this.ArraysService.safeContacts();
    // TODO    createdContactSuccessfully();
    //     hideAddContactCard();
    }
    // document.getElementById('form_add_contact').reset();
    this.ammountOfDisplayedcontacts++; 
     await this.resetForm(data);
        //TODO confimationMessage();
        setTimeout(() => {
          this.showSlider();
        }, 2000);
  }

  resetForm(data) {
    data.name == '';
    data.email == '';
    data.phone == '';
  }
  /**
   * Asynchronous function to edit and update an existing contact to the "contacts" array
   */
  async editContact(data) {
    this.ArraysService.contacts[this.selectedContactIndex].name = data.name;
    this.ArraysService.contacts[this.selectedContactIndex].email = data.email;
    this.ArraysService.contacts[this.selectedContactIndex].phone = data.phone;
    this.ArraysService.safeContacts();

    //TODO confimationMessage();
    setTimeout(() => {
      this.showEditSlider();
    }, 2000);
  }

  /**
   * Function to delete a contact from the "contacts" array
   */
  deleteContact() {
    this.ArraysService.contacts.splice(this.selectedContactIndex, 1);
    this.ArraysService.safeContacts();
    this.selectedContactIndex = -1;
    this.ammountOfDisplayedcontacts--; 
    //TODO confimationMessage();
  }
  getContactById(index: number) {
    this.selectedContactIndex = index;
    this.selectedContact = this.ArraysService.contacts[index];
  }
  /**
   * Function to generate a random color for the user circle
   */
  getRandomUserCircleColor(): string {
    let randomIndex = Math.floor(Math.random() * this.userCircleColors.length);
    return this.userCircleColors[randomIndex];
  }

  showSlider() {
    this.addContactContainer.nativeElement.classList.toggle('show-slider');
  }
  showEditSlider() {
    this.editContactContainer.nativeElement.classList.toggle('show-slider');
  }
}
