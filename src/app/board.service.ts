import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BoardService {
  showSummary: boolean = true;
  showAddTask: boolean = false;
  showBoard: boolean = false;
  showContacts: boolean = false;
  showPrivacyPolicy: boolean = false;
  showLegalNotice: boolean = false;
  showInfo: boolean = false;
}
