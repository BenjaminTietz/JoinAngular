import { Component, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { RemotestorageService } from '../remotestorage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  @Output() toggleShowLogin: EventEmitter<boolean> = new EventEmitter();

  constructor(private router: Router, private RemotestorageService: RemotestorageService) { 
  }

/**
 * Logs in the user as a guest. If a guest user is already logged in, it clears the guest user data and logs in the current user as a guest.
 * After logging in as a guest, it redirects the user to the "summary.html" page.
 */
async guestLogIn() {
  if (this.RemotestorageService.guestUser != null) {
      // Get the current user data
      this.RemotestorageService.currentUser = JSON.parse(await this.RemotestorageService.getItem('user'));
      
      // Add the current user to the guestUser array
      this.RemotestorageService.guestUser.push(this.RemotestorageService.currentUser);
      
      // Clear the guestUser array
      this.RemotestorageService.guestUser = [];
      
      // Save the updated guestUser array to localStorage
      await this.RemotestorageService.setItem('user', JSON.stringify(this.RemotestorageService.guestUser) || "");
      console.log('guestUser: ', this.RemotestorageService.guestUser);
      // Redirect to the "summary-component" page
      this.router.navigate(['/summary']);
      this.toggleShowLogin.emit(false); // set showLogin in AppComponent to false.
  } else {
      // If no guest user data is present, simply redirect to the "summary-component" page
      this.router.navigate(['/summary']);
      this.toggleShowLogin.emit(false); // set showLogin in AppComponent to false.
  };
};




  redirectToSignup() {
    this.router.navigate(['/signup']);
    this.toggleShowLogin.emit(false); // Setze showLogin auf false in der AppComponent.
  }

  redirectToSummary() {
    this.router.navigate(['/summary']);
    this.toggleShowLogin.emit(false); // Setze showLogin in der AppComponent auf false.
  }


}
