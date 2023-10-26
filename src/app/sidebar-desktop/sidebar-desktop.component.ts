import { Component, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar-desktop',
  templateUrl: './sidebar-desktop.component.html',
  styleUrls: ['./sidebar-desktop.component.scss']
})
export class SidebarDesktopComponent {
  
  constructor(private router: Router) { }

  redirectToSummary() {
    this.router.navigate(['/summary']);
    
  }

  redirectToAddTask() {
    this.router.navigate(['/addtask']);
  }

  redirectToBoard() {
    this.router.navigate(['/board']);
  }

  
  redirectToContacts() {
    this.router.navigate(['/contacts']);
  }
}
