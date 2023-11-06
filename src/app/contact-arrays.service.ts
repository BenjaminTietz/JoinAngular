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
  public contactsForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [
      Validators.required,
      Validators.minLength(4),
      Validators.email,
    ]),
    phone: new FormControl('', [
      Validators.required,
      Validators.minLength(4),
      Validators.pattern('[- +()0-9]+'),
    ]),
  });

  public contactsFormFB: FormGroup;

  constructor(
    public RemotestorageService: RemotestorageService,
    private fb: FormBuilder
  ) {
    this.contactsFormFB = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
    this.contactsFormFB.valueChanges.subscribe(console.log);
  }

  ngOnInit() {
    this.loadContacts();
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

  /**
   * Asynchronous function to save all contacts from array "contacts" to remote storage
   */
  async safeContacts() {
    await this.RemotestorageService.setItem(
      'contact_array',
      JSON.stringify(this.contacts)
    );
    // TODO  await this.RemotestorageService.setItem('initials_array', JSON.stringify(this.initials));
  }

  /**
   * Asynchronous function to load all contacts from the remote storage and assign them to the "contacts" array
   */
  async loadContacts() {
    this.contacts = JSON.parse(
      await this.RemotestorageService.getItem('contact_array')
    );
    console.log('loaded this contacts from RS', this.contacts);
    // TODO this.initials = JSON.parse(await this.RemotestorageService.getItem('initials_array'));
  }
}
