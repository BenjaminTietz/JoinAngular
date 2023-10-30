import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ArraysService {

  constructor() { }

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
     * An array that stores the information of the contacts soted apphabetically.
     * 
     * @type {Array}
     */
    sortedalphabetically: Array<any> = [];
}
