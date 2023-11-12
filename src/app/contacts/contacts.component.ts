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
import { TaskArraysService } from '../task-arrays.service';

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
  @ViewChild('popupContainerDelete ') popupContainerDelete: ElementRef;

  /**
 * Index of the selected contact within the "contacts" array.
 * Initialized with -1 to indicate no selected contact initially.
 * @type {number}
 */
selectedContactIndex: number = -1;

/**
 * The selected contact object from the "contacts" array or null if none is selected.
 * @type {ArraysService['contacts'][number] | null}
 */
selectedContact: ArraysService['contacts'][number] | null;

/**
 * Index of the selected sorted contact.
 * Initialized with 0 as the default selected sorted contact.
 * @type {number}
 */
selectedSortedContactIndex: number = 0;

/**
 * The number of displayed contacts.
 * @type {number}
 */
ammountOfDisplayedcontacts: number = 0;

/**
 * The identifier for the new contacts.
 * @type {number}
 */
contactId: number = 0;

/**
 * A FormGroup object used for managing form data.
 * @type {FormGroup}
 */
form: FormGroup;

/**
 * Index of the contact to delete within the "contacts" array.
 * @type {number}
 */
indexToDelete: number;

/**
 * Index of the contact to edit within the "contacts" array.
 * @type {number}
 */
indexToEdit: number;

/**
 * An array of predefined user circle colors used for contact profile icons.
 *
 * @type {string[]}
 */
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
    private fb: FormBuilder,
    public TaskArraysService: TaskArraysService
  ) {
    this.ArraysService.contactsForm.valueChanges.subscribe(console.log);
  }

/**
 * Asynchronous lifecycle method that initializes the component.
 * It sorts contacts alphabetically, updates the displayed contact count, generates contact IDs,
 * and groups/sorts contacts based on their initials.
 *
 * @returns {Promise<void>}
 */
  async ngOnInit() {
    this.ArraysService.sortContactsAlphabetically(this.ArraysService.contacts);
    this.ammountOfDisplayedcontacts = this.ArraysService.contacts.length;
    this.generateContactId();
    this.groupAndSortContacts();
  }

/**
 * Add a new contact to the "contacts" array.
 *
 * @param {string} name - The name of the new contact.
 * @param {string} email - The email of the new contact.
 * @param {number} phone - The phone number of the new contact.
 */
  pushToArray(name, email, phone) {
  /**
   * Generates a random color for the new contact's profile icon.
   * @returns {string} A hexadecimal color code.
   */
  let color = this.getRandomUserCircleColor();
  // Generate a unique ID for the new contact.
  let id = this.contactId;
  // Create the new contact object and push it into the "contacts" array.
  this.ArraysService.contacts.push({
    id: id,
    name: name,
    email: email,
    phone: phone,
    color: color,
  });
  // Save the updated "contacts" array.
  this.ArraysService.safeContacts();
}

  /**
   * Asynchronously generates a unique contact ID based on the existing contact data.
   * If the "contacts" array is empty, it sets the initial contact ID to 0.
   *
   * @returns {Promise<void>}
   */
  async generateContactId() {
    // First, filter out existing contact IDs from the "contacts" array and convert them to numbers.
    let contactIds = this.ArraysService.contacts.length;

    // If the "contacts" array is empty, it sets the initial contact ID to 0.
    if (contactIds === 0) {
      this.contactId = 0;
    }
  }

  /**
   * Generates the index of the contact to delete based on the selected contact's ID.
   */
  generateIndexToDelete() {
    // Get the ID of the selected contact.
    let id = this.selectedContact.id;

    // Find the index of the contact to delete in the "contacts" array.
    this.indexToDelete = this.ArraysService.contacts.findIndex(
      (contact) => contact.id === id
    );
  }

  /**
   * Generates the index of the contact to edit based on the selected contact's ID.
   */
  generateIndexToEdit() {
    // Get the ID of the selected contact.
    let id = this.selectedContact.id;
    // Find the index of the contact to edit in the "contacts" array.
    this.indexToEdit = this.ArraysService.contacts.findIndex(
      (contact) => contact.id === id
    );
  }

  /**
   * Asynchronous function to add a new contact to the "contacts" array.
   *
   * @param {Object} data - The data for the new contact, including name, email, and phone.
   * @returns {Promise<void>}
   */
  async addContact(data) {
    // Find the maximum ID in the contacts array and calculate the new ID.
    let maxId = 0;
    this.ArraysService.contacts.forEach((contact) => {
      if (contact.id > maxId) {
        maxId = contact.id;
      }
    });

    // Calculate the new contact's ID, initials, and color.
    let newId = maxId + 1;
    let initials = this.extractInitials(data.name);
    let color = this.getRandomUserCircleColor();

    // Create the new contact object.
    let newContact = {
      id: newId,
      name: data.name,
      email: data.email,
      phone: data.phone,
      color: color,
      initials: initials,
    };

    // Add the new contact to the "contacts" array and reset sorting.
    this.ArraysService.contacts.push(newContact);
    this.ArraysService.sortedalphabetically = [];

    // Save the contacts data if required fields are not empty.
    if (data.name !== '' && data.email !== '' && data.phone !== '') {
      this.ArraysService.safeContacts();
    }

    // Update the displayed contact count and reset the add contact form.
    this.ammountOfDisplayedcontacts++;
    await this.ArraysService.resetAddContactForm();

    // Show the create popup and the slider after a short delay.
    this.showCreatePopup();
    setTimeout(() => {
      this.showSlider();
      this.showCreatePopup();
    }, 2000);

    // Trigger component initialization.
    this.ngOnInit();
  }

  /**
   * Asynchronous function to edit and update an existing contact in the "contacts" array.
   *
   * @param {Object} data - The updated data for the contact, including name, email, and phone.
   * @returns {Promise<void>}
   */
  async editContact(data) {
    // Generate the index of the contact to edit.
    await this.generateIndexToEdit();

    // Update the contact's information with the provided data.
    this.ArraysService.contacts[this.indexToEdit].name = data.name;
    this.ArraysService.contacts[this.indexToEdit].email = data.email;
    this.ArraysService.contacts[this.indexToEdit].phone = data.phone;

    // Save the updated contacts data.
    this.ArraysService.safeContacts();

    // Show the create popup and the edit slider after a short delay.
    this.showCreatePopup();
    setTimeout(() => {
      this.showEditSlider();
      this.showCreatePopup();
    }, 2000);

    // Trigger component initialization, mobile detail view, and any other necessary actions.
    this.ngOnInit();
    this.showMobileDetailView();
  }

  /**
   * Asynchronous function to delete a contact from the "contacts" array.
   * This function also removes the contact from the "assigned" arrays of associated tasks.
   *
   * @returns {Promise<void>}
   */
  async deleteContact() {
    // Generate the index of the contact to delete.
    await this.generateIndexToDelete();
    // Get the contact to be deleted from the "contacts" array.
    let contactToDelete = this.ArraysService.contacts[this.indexToDelete];
    // Loop through the TaskArrayService.tasks and remove the contact from the "assigned" array of each task.
    for (let task of this.TaskArraysService.tasks) {
      let index = task.assigned.findIndex(
        (contact) => contact.id === contactToDelete.id
      );
      if (index !== -1) {
        task.assigned.splice(index, 1);
      }
    }
    // Save the updated tasks with the removed contact.
    this.TaskArraysService.safeTasks();
    // Remove the contact from the "contacts" array.
    this.ArraysService.contacts.splice(this.indexToDelete, 1);
    // Save the updated "contacts" array.
    this.ArraysService.safeContacts();
    // Show the delete popup and trigger component initialization and mobile detail view.
    this.showDeletePopup();
    this.ngOnInit();
    this.showMobileDetailView();
  }

  /**
   * Set the selected contact based on the provided index.
   *
   * @param {number} index - The index of the contact to be selected.
   */
  getContactById(index) {
    // Set the selected contact index.
    this.selectedContactIndex = index;
    // Set the selected contact based on the provided index.
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

  /**
   * Group and sort the contacts based on their initials.
   * This function populates the "sortedAndGroupedContacts" property in the "ArraysService".
   */
  groupAndSortContacts() {
    // Populate the "sortedAndGroupedContacts" property by grouping and sorting contacts.
    this.ArraysService.sortedAndGroupedContacts = this.getInitials(
      this.ArraysService.contacts
    );
  }

  /**
   * Group and sort contacts based on their initials.
   *
   * @param {any[]} contacts - An array of contacts to be grouped and sorted.
   * @returns {any} - An object representing the grouped and sorted contacts.
   */
  getInitials(contacts) {
    // Initialize an object to group contacts by their initials.
    let groupedContacts = {};
    // Iterate through the contacts and group them by the first letter of their names.
    contacts.forEach((contact) => {
      let match = contact.name.match(/[A-Z]/g);
      let firstLetters = match ? match.join('') : '';

      if (!groupedContacts[firstLetters]) {
        groupedContacts[firstLetters] = [];
      }
      groupedContacts[firstLetters].push(contact);
    });
    // Sort the groups by the initial letter.
    let sortedGroups = Object.keys(groupedContacts).sort();
    // Create a sorted array of contacts grouped by initial letter.
    let sortedContacts = [];
    sortedGroups.forEach((group) => {
      sortedContacts.push({
        letter: group,
        contacts: groupedContacts[group],
      });
    });
    return sortedContacts;
  }

/**
 * Toggles the visibility of the slider for adding a new contact.
 */
 showSlider() {
  this.addContactContainer.nativeElement.classList.toggle('show-slider');
}

/**
 * Toggles the visibility of the slider for editing a contact.
 * It also populates the edit form with the selected contact's data.
 */
  showEditSlider() {
  this.selectedContact = this.selectedContact;
  this.ArraysService.editContactForm.patchValue(this.selectedContact);
  this.editContactContainer.nativeElement.classList.toggle('show-slider');
}

/**
 * Toggles the visibility of the mobile detail view based on the browser width.
 */
  showMobileDetailView() {
  let currentBrowserWidth = window.innerWidth;
  if (currentBrowserWidth < 1200) {
    this.mobileDetailView.nativeElement.classList.toggle('show-mobile-detailview');
  }
}

/**
 * Toggles the visibility of the mobile contact menu.
 */
  openMobileContactMenu() {
  this.mobileMenuWrapper.nativeElement.classList.toggle('show-mobile-contact-menu');
}

/**
 * Toggles the visibility of the create popup for contact addition.
 */
  showCreatePopup() {
  this.popupContainer.nativeElement.classList.toggle('showPopup');
}

/**
 * Shows the delete popup and automatically hides it after 1500 milliseconds.
 */
  showDeletePopup() {
  this.popupContainerDelete.nativeElement.classList.add('showPopup');

  setTimeout(() => {
    this.popupContainerDelete.nativeElement.classList.remove('showPopup');
  }, 1500);
}
}
