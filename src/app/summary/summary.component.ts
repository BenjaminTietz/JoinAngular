import { Component, Output, EventEmitter, Input } from '@angular/core';
import { SidebarDesktopComponent } from '../sidebar-desktop/sidebar-desktop.component';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent {
  @Output() toggleShowSignup: EventEmitter<boolean> = new EventEmitter();


  constructor() { }
}