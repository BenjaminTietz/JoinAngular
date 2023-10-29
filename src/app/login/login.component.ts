import { Component, Output, EventEmitter, ViewChild, ElementRef, OnInit, NgModule } from '@angular/core';
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
    this.loadUsers();
    console.log('users: ', this.users);
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
 * Loads users' data from local storage.
 * @throws {Error} If there's an error parsing the data.
 */
async loadUsers() {
  try {
      this.users = JSON.parse(await this.RemotestorageService.getItem('users'));
  } catch (e) {
      console.error('Loading error:', e);
      throw new Error('Error loading users data');
  };
};

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
async logIn(data) {
  console.log(data, this.users);
  let user = this.users.find(u => u.email == data.email && u.password == data.password);
  if (user) {
      await this.RemotestorageService.setItem('user', JSON.stringify(user));
      this.currentUser = JSON.parse(await this.RemotestorageService.getItem('user'));
      this.router.navigate(['/summary']);
      data.email = '';
      data.password = '';
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
