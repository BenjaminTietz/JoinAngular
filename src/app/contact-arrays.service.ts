import { Injectable, OnInit } from '@angular/core';
import { RemotestorageService } from './remotestorage.service';
import { ContactsComponent } from './contacts/contacts.component';

@Injectable({
  providedIn: 'root'
})
export class ArraysService {

  constructor(public RemotestorageService: RemotestorageService) { }

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
    console.log('loaded this contacts from RS',this.contacts);
    // TODO this.initials = JSON.parse(await this.RemotestorageService.getItem('initials_array'));
  }
}
