import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  titel = "Join";
  showLogin = true;
  showSignup = false;

  toggleShowLogin(show: boolean) {
    this.showLogin = show;
  }

  toggleShowSignup(show: boolean) {
    this.showSignup = show;
  }
}
