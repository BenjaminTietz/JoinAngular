import { Component, Output, EventEmitter, ViewChild, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RemotestorageService } from '../remotestorage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  @ViewChild('userEmail') userEmail: ElementRef;
  @ViewChild('userPassword') userPassword: ElementRef;


  constructor(private router: Router, public RemotestorageService: RemotestorageService) { 
  }

  async ngOnInit() {

  }

  /**
 * An array that stores the list of users.
 * 
 * @type {Array}
 */
  users: Array<any> = [];

  /**
   * An array that stores the information of the currently logged-in user.
   * 
   * @type {Array}
   */
  currentUser: Array<string> = [];
  
  /**
   * An array that stores the information of the guest user.
   * 
   * @type {Array}
   */
  guestUser: Array<any> = [];
/**
 * Logs in the user as a guest. If a guest user is already logged in, it clears the guest user data and logs in the current user as a guest.
 * After logging in as a guest, it redirects the user to the "summary-component" page.
 */
async guestLogIn() {
  if (this.guestUser && this.guestUser.length > 0) {
      // Get the current user data
      this.currentUser = JSON.parse(await this.RemotestorageService.getItem('user'));
      
      // Add the current user to the guestUser array
      this.guestUser.push(this.currentUser);
      
      // Clear the guestUser array
      this.guestUser = [];
      
      // Save the updated guestUser array to localStorage
      await this.RemotestorageService.setItem('user', JSON.stringify(this.guestUser) || "");
      console.log('guestUser: ', this.guestUser);
      // Redirect to the "summary-component" page
      this.router.navigate(['/summary']);
} else {
      // If no guest user data is present, simply redirect to the "summary-component" page
      this.router.navigate(['/summary']);
};
};

/**
 * This function search for User Data and than try with that data to login into JOIN
 */
async logIn() {
  debugger;
  let email = this.userEmail.nativeElement;
  let password = this.userPassword.nativeElement;

  let user = this.users.find(u => u.email == email.value && u.password == password.value);
  if (user) {
      await this.RemotestorageService.setItem('user', JSON.stringify(user) || "");
      this.currentUser = JSON.parse(await this.RemotestorageService.getItem('user'));
      this.router.navigate(['/summary']);
      email.value = '';
      password.value = '';
  } else {
      //TODO implement function failedLogIn(email, password);
  };
};


  redirectToSignup() {
    this.router.navigate(['/signup']);
}

  redirectToSummary() {
    this.router.navigate(['/summary']);
}


}
