import { Component, Output, EventEmitter, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { BoardService } from '../board.service';
import { LoginService } from '../login.service';
import { RemotestorageService } from '../remotestorage.service';
import { ArraysService } from '../contact-arrays.service';
import { TaskArraysService } from '../task-arrays.service';
@Component({
  selector: 'app-header-desktop',
  templateUrl: './header-desktop.component.html',
  styleUrls: ['./header-desktop.component.scss']
})
export class HeaderDesktopComponent {
  @Output() componentSelected = new EventEmitter<string>();  
  constructor(public router: Router, private boardService: BoardService, public LoginService: LoginService, public RemotestorageService: RemotestorageService, public ArraysService: ArraysService, public TaskArraysService: TaskArraysService ) { }
  @ViewChild('dropdown') dropdown: ElementRef;
  
/**
 * Toggles the visibility of the dropdown element.
 */
showDropdown() {
  /**
   * This function toggles the 'show' CSS class on the native DOM element,
   * making the dropdown visible or hidden.
   */
  this.dropdown.nativeElement.classList.toggle('show');
}

/**
 * Selects a component based on its name and updates the visibility of related components.
 *
 * @param {string} componentName - The name of the component to select.
 * @param {Event} e - The event object (click event) that triggered the component selection.
 */
selectComponent(componentName, e) {
  e.stopPropagation();

  // Define the mapping between component names and visibility properties
  const componentVisibilityMap = {
    'app-introduction': { showSummary: false, showAddTask: false, showBoard: false, showContacts: false, showPrivacyPolicy: false, showLegalNotice: false, showInfo: true },
    'app-summary': { showSummary: true, showAddTask: false, showBoard: false, showContacts: false, showPrivacyPolicy: false, showLegalNotice: false, showInfo: false },
    'app-privacy-policy': { showSummary: false, showAddTask: false, showBoard: false, showContacts: false, showPrivacyPolicy: true, showLegalNotice: false, showInfo: false },
    'app-legal-notice': { showSummary: false, showAddTask: false, showBoard: false, showContacts: false, showPrivacyPolicy: false, showLegalNotice: true, showInfo: false },
  };

  // Update the visibility properties based on the selected component
  let visibilityProperties = componentVisibilityMap[componentName];
  if (visibilityProperties) {
    Object.assign(this.boardService, visibilityProperties);
  }
}
}

