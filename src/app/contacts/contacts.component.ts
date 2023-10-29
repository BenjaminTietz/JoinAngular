import { Component, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent {
  @ViewChild('addContactContainer') addContactContainer: ElementRef;
  
  showSlider() {
    this.addContactContainer.nativeElement.classList.toggle('show-slider');
  }
}
