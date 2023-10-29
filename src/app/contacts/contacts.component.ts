import { Component, ViewChild, ElementRef, NgModule, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RemotestorageService } from '../remotestorage.service';
@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent {
  @ViewChild('inputName') inputName: ElementRef;
  @ViewChild('inputEmail') inputEmail: ElementRef;
  @ViewChild('inputPhone') inputPhone: ElementRef;
  @ViewChild('addContactContainer') addContactContainer: ElementRef;
  
  contacts = [];

  constructor(private router: Router, public RemotestorageService: RemotestorageService) { }

  async ngOnInit() {
    this.loadContacts();
    console.log('contacts: ', this.contacts);
  }
/**
 * Function to push the entered contacts into the "contacts" array
 * @param {string} name - This is the name of an existing contact
 * @param {string} email - This is the email of an existing contact
 * @param {number} phone - This is the phone number of an existing contact
 * @param {string} color - - This is the color which gets assigned to an existing contact
 */
  pushToArray(name, email, phone) {
  this.contacts.push(
      {
          'name': name,
          'email': email,
          'phone': phone
      }
  );
  console.log(this.contacts);
  this.safeContacts();
}
/**
 * Asynchronous function to save all contacts from array "contacts" to remote storage
 */
async safeContacts() {
  await this.RemotestorageService.setItem('contact_array', JSON.stringify(this.contacts));
  // TODO await setItem('initials_array', JSON.stringify(initials));
}
/**
 * Asynchronous function to load all contacts from the remote storage and assign them to the "contacts" array
 */
async loadContacts() {
  this.contacts = JSON.parse(await this.RemotestorageService.getItem('contact_array'));
  console.log(this.contacts);
  //TODO this.initials = JSON.parse(await getItem('initials_array'));
}
/**
 * Asynchronous function to add a new contact to the "contacts" array
 */
async addContact(data) {
console.log(data.name, data.email, data.phone);
  // TODO sortedalphabetically = [];
  // if (name != '' && email != '' && phone != '') {
  //     pushToArray(name, email, phone);
  //     await safeContacts();
  //     createdContactSuccessfully();
  //     hideAddContactCard();
  // }
  // document.getElementById('form_add_contact').reset();
  // await refresh();
  this.pushToArray(data.name, data.email, data.phone);
  this.safeContacts();
}
  showSlider() {
    this.addContactContainer.nativeElement.classList.toggle('show-slider');
  }

}
