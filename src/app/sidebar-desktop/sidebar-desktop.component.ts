import { Component, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar-desktop',
  templateUrl: './sidebar-desktop.component.html',
  styleUrls: ['./sidebar-desktop.component.scss']
})
export class SidebarDesktopComponent {




  constructor(public router: Router) { }


}
