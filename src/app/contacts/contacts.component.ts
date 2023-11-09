import {
  Component,
  ViewChild,
  ElementRef,
  NgModule,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { RemotestorageService } from '../remotestorage.service';
import { ArraysService } from '../contact-arrays.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

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
  @ViewChild('mobileDetailView') mobileDetailView: ElementRef;
  @ViewChild('mobileMenuWrapper') mobileMenuWrapper: ElementRef;
  @ViewChild('popupContainer ') popupContainer: ElementRef;

  selectedContactIndex: number = -1; // Initialisieren mit -1, um kein Element anzuzeigen
  selectedContact: ArraysService['contacts'][number] | null;
  selectedSortedContactIndex: number = 0;
  ammountOfDisplayedcontacts: number = 0;
  contactId: number = 0;
  form: FormGroup;
  indexToDelete: number;
  indexToEdit: number;

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
    '#FFBB2B',
  ];
  constructor(
    private router: Router,
    public RemotestorageService: RemotestorageService,
    public ArraysService: ArraysService,
    private fb: FormBuilder
  ) {
    this.ArraysService.contactsForm.valueChanges.subscribe(console.log);
  }

  async ngOnInit() {
    this.ArraysService.sortContactsAlphabetically(this.ArraysService.contacts);
    this.ammountOfDisplayedcontacts = this.ArraysService.contacts.length;
    this.generateContactId();
    this.groupAndSortContacts();
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
    let id = this.contactId;
    this.ArraysService.contacts.push({
      id: id,
      name: name,
      email: email,
      phone: phone,
      color: color,
    });
    this.ArraysService.safeContacts();
  }
  async generateContactId() {
    // first filter out IDs from the "contacts" array and convert them to numbers (from strings)
    let contactIds = this.ArraysService.contacts.length;

    // if contacts is empty, set the ID to 1
    if (contactIds === 0) {
      this.contactId = 0;
    }
  }

  generateIndexToDelete() {
    console.log('contacts array', this.ArraysService.contacts);
    console.log('selectedContact', this.selectedContact);
    let id = this.selectedContact.id;
    console.log('id of contact', id);
    this.indexToDelete = this.ArraysService.contacts.findIndex(
      (contact) => contact.id === id
    );
    console.log('indexToDelete', this.indexToDelete);
  }

  generateIndexToEdit() {
    console.log('contacts array', this.ArraysService.contacts);
    console.log('selectedContact', this.selectedContact);
    let id = this.selectedContact.id;
    console.log('id of contact', id);
    this.indexToEdit = this.ArraysService.contacts.findIndex(
      (contact) => contact.id === id
    );
    console.log('indexToDelete', this.indexToDelete);
  }

  /**
   * Asynchronous function to add a new contact to the "contacts" array
   */
  async addContact(data) {
    let maxId = 0;
    this.ArraysService.contacts.forEach((contact) => {
      if (contact.id > maxId) {
        maxId = contact.id;
      }
    });
  
    // find max id in contacts array + 1
    let newId = maxId + 1;
  
    let initials = this.extractInitials(data.name);
    let color = this.getRandomUserCircleColor();
  
    let newContact = {
      id: newId,
      name: data.name,
      email: data.email,
      phone: data.phone,
      color: color,
      initials: initials,
    };
  
    this.ArraysService.contacts.push(newContact);
    this.ArraysService.sortedalphabetically = [];
  
    if (data.name != '' && data.email != '' && data.phone != '') {
      this.ArraysService.safeContacts();
    }
  
    this.ammountOfDisplayedcontacts++;
    await this.ArraysService.resetAddContactForm();
    this.showCreatePopup();
    setTimeout(() => {
      this.showSlider();
      this.showCreatePopup();
    }, 2000);
    this.ngOnInit();
  }

  /**
   * Asynchronous function to edit and update an existing contact to the "contacts" array
   */
  async editContact(data) {
    await this.generateIndexToEdit();

    this.ArraysService.contacts[this.indexToEdit].name = data.name;
    this.ArraysService.contacts[this.indexToEdit].email = data.email;
    this.ArraysService.contacts[this.indexToEdit].phone = data.phone;
    this.ArraysService.safeContacts();

    this.showCreatePopup();
    setTimeout(() => {
      this.showEditSlider();
      this.showCreatePopup();
    }, 2000);
    this.ngOnInit();
    this.showMobileDetailView();
  }

  /**
   * Function to delete a contact from the "contacts" array
   */
  async deleteContact() {
    await this.generateIndexToDelete();

    this.ArraysService.contacts.splice(this.indexToDelete, 1);
    this.ArraysService.safeContacts();

    this.ngOnInit();
    this.showMobileDetailView();
    //TODO confimationMessage()
    //short delay before hiding the slider
  }

  getContactById(index: number) {
    this.selectedContactIndex = index;
    this.selectedContact = this.ArraysService.sortedalphabetically[index];
  }

  /**
   * Function to generate a random color for the user circle
   */
  getRandomUserCircleColor(): string {
    let randomIndex = Math.floor(Math.random() * this.userCircleColors.length);
    return this.userCircleColors[randomIndex];
  }
  /**
   * Extracts the uppercase initials from the array "contacts"['name']
   * @param {Array} sortedContacts - This is the sorted Contacts Array
   */
  extractInitials(name: string): string {
    let match = name.match(/[A-Z]/g);
    return match ? match.join('') : '';
  }

  groupAndSortContacts() {
    this.ArraysService.sortedAndGroupedContacts = this.getInitials(this.ArraysService.contacts);
  }

  getInitials(contacts: any[]): any {
    let groupedContacts: { [key: string]: any[] } = {};
  
    contacts.forEach((contact) => {
      let match = contact.name.match(/[A-Z]/g);
      let firstLetters = match ? match.join('') : '';
  
      if (!groupedContacts[firstLetters]) {
        groupedContacts[firstLetters] = [];
      }
  
      groupedContacts[firstLetters].push(contact);
    });
  
    // Sortiere die Gruppen nach dem Anfangsbuchstaben
    let sortedGroups = Object.keys(groupedContacts).sort();
  
    // Erstelle ein sortiertes Array der Kontakte
    let sortedContacts = [];
    sortedGroups.forEach((group) => {
      sortedContacts.push({
        letter: group,
        contacts: groupedContacts[group],
      });
    });
  
    return sortedContacts;
  }
  


  showSlider() {
    this.addContactContainer.nativeElement.classList.toggle('show-slider');
  }
  showEditSlider() {
    this.selectedContact = this.selectedContact;
    this.ArraysService.editContactForm.patchValue(this.selectedContact);
    this.editContactContainer.nativeElement.classList.toggle('show-slider');
  }
  showMobileDetailView() {
    let currentBrowserWidth = window.innerWidth;
    if (currentBrowserWidth < 1200) {
      this.mobileDetailView.nativeElement.classList.toggle(
        'show-mobile-detailview'
      );
    }
  }
  openMobileContactMenu() {
    this.mobileMenuWrapper.nativeElement.classList.toggle(
      'show-mobile-contact-menu'
    );
  }

  showCreatePopup() {
    this.popupContainer.nativeElement.classList.toggle('showPopup');
  }
}
