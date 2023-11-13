import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BoardService {
/**
   * Controls the visibility of the "Summary" component.
   */
showSummary: boolean = true;

/**
 * Controls the visibility of the "Add Task" component.
 */
showAddTask: boolean = false;

/**
 * Controls the visibility of the "Board" component.
 */
showBoard: boolean = false;

/**
 * Controls the visibility of the "Contacts" component.
 */
showContacts: boolean = false;

/**
 * Controls the visibility of the "Privacy Policy" component.
 */
showPrivacyPolicy: boolean = false;

/**
 * Controls the visibility of the "Legal Notice" component.
 */
showLegalNotice: boolean = false;

/**
 * Controls the visibility of the "Info" component.
 */
showInfo: boolean = false;
}
