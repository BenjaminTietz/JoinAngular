import { Component, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  @Output() toggleShowLogin: EventEmitter<boolean> = new EventEmitter();

  constructor(private router: Router) { }

  redirectToSignup() {
    this.router.navigate(['/signup']);
    this.toggleShowLogin.emit(false); // Setze showLogin auf false in der AppComponent.
  }

  redirectToSummary() {
    this.router.navigate(['/summary']);
    this.toggleShowLogin.emit(false); // Setze showLogin in der AppComponent auf false.
  }
}
