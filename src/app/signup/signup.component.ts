// In signup.component.ts
import { Component, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
  @Output() toggleShowLogin: EventEmitter<boolean> = new EventEmitter();

  constructor(private router: Router) { }

  redirectToLogin() {
    this.router.navigate(['/login']);
    this.toggleShowLogin.emit(true); // Setze showLogin in der AppComponent auf true.
  }
}
