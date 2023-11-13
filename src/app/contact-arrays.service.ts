import { Injectable, OnInit } from '@angular/core';
import { RemotestorageService } from './remotestorage.service';
import { ContactsComponent } from './contacts/contacts.component';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class ArraysService {
/**
 * Represents a form group used for managing contact information.
 */
public contactsForm: FormGroup = new FormGroup({
  /**
   * Represents the input field for the contact's name.
   */
  name: new FormControl('', [Validators.required]),

  /**
   * Represents the input field for the contact's email address.
   */
  email: new FormControl('', [
    Validators.required,
    Validators.minLength(4),
    Validators.email,
  ]),

  /**
   * Represents the input field for the contact's phone number.
   */
  phone: new FormControl('', [
    Validators.required,
    Validators.minLength(4),
    Validators.pattern('[- +()0-9]+'),
  ]),
});

/**
 * Represents a form group used for editing contact information.
 */
public editContactForm: FormGroup = new FormGroup({
  /**
   * Represents the input field for the contact's name in the edit form.
   */
  name: new FormControl('', [Validators.required]),

  /**
   * Represents the input field for the contact's email address in the edit form.
   */
  email: new FormControl('', [
    Validators.required,
    Validators.minLength(4),
    Validators.email,
  ]),

  /**
   * Represents the input field for the contact's phone number in the edit form.
   */
  phone: new FormControl('', [
    Validators.required,
    Validators.minLength(4),
    Validators.pattern('[- +()0-9]+'),
  ]),
});


/**
 * Represents a form group for creating new contacts using FormBuilder.
 */
public contactsFormFB: FormGroup;

/**
 * Represents a form group for editing contact information using FormBuilder.
 */
public editContactFormFB: FormGroup;


/**
 * Creates an instance of the ContactsComponent.
 *
 * @param {RemotestorageService} RemotestorageService - The service for remote storage.
 * @param {FormBuilder} fb - The FormBuilder service for creating form groups.
 */
constructor(public RemotestorageService: RemotestorageService, private fb: FormBuilder) {
  this.contactsFormFB = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.minLength(6)]],
  });

  this.editContactFormFB = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.minLength(6)]],
  });

  this.sortedalphabetically = [];
}

/**
 * Represents a collection of sorted and grouped contacts.
 */
sortedAndGroupedContacts;

/**
 * Initializes the component. It loads contacts and sorts them alphabetically.
 */
ngOnInit() {
  this.loadContacts();
  this.sortContactsAlphabetically(this.contacts);
}

  /**
   * An array that stores the list of users.
   *
   * @type {Array}
   */
  users: Array<any> = [];

  /**
   * An array that stores the information of the currently logged-in user.
   *
   * @type {Array}
   */
  currentUser: Array<string> = [];

  /**
   * An array that stores the information of the guest user.
   *
   * @type {Array}
   */
  guestUser: Array<any> = [];

  /**
   * An array that stores the information of the contacts.
   *
   * @type {Array}
   */
  contacts: Array<any> = [];

  /**
   * An array that stores the information of the contacts sorted apphabetically.
   *
   * @type {Array}
   */
  sortedalphabetically: Array<any> = [];

  /**
   * An array that stores the initials of the contacts sorted contacts.
   *
   * @type {Array}
   */
  initials: Array<any> = [];

  selectedContact: number;

  resetAddContactForm() {
    this.contactsForm.reset();
  }


  /**
   * Function to sort the contacts alphabetically
   * @param {Array} contacts - This is the array of contacts
   */
  sortContactsAlphabetically(contacts) {
    this.sortedalphabetically = contacts.slice().sort((a, b) =>
      a.name.localeCompare(b.name)
    );
  }

  
  /**
   * Asynchronous function to save all contacts from array "contacts" to remote storage
   */
  async safeContacts() {
    await this.RemotestorageService.setItem(
      'contact_array',
      JSON.stringify(this.contacts)
    );
  }

  /**
   * Asynchronous function to load all contacts from the remote storage and assign them to the "contacts" array
   */
  async loadContacts() {
    this.contacts = JSON.parse(
      await this.RemotestorageService.getItem('contact_array')
    );
  }
}
