import { Component, Output, EventEmitter, Input } from '@angular/core';
import { BoardService } from '../board.service';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss'],

})
export class SummaryComponent {
  constructor(public boardService: BoardService) {}

  @Input() showSummary: boolean;
  @Input() showAddTask: boolean;
  @Input() showBoard: boolean;
  @Input() showContacts: boolean;
  @Input() showPrivacyPolicy: boolean;
  @Input() showLegalNotice: boolean;
  @Input() showInfo: boolean;  
}