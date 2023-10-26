import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent {
  @Output() toggleShowSignup: EventEmitter<boolean> = new EventEmitter();

  constructor() { }
}