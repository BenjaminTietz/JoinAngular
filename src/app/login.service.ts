import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { RemotestorageService } from './remotestorage.service';
import { ArraysService } from './contact-arrays.service';

import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  public logInForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(4),
    ]),
  });
  public signUpForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(4),
    ]),
    confirmPassword: new FormControl('', [
      Validators.required,
      Validators.minLength(4),
    ]),
  });

  public loginFormFB: FormGroup;
  public signUpFormFB: FormGroup;

  userGreeting;
  currentUser;
  currentUserEmail;
  constructor(
    private router: Router,
    private fb: FormBuilder,
    public RemotestorageService: RemotestorageService,
    public ArraysService: ArraysService
  ) {
    this.loginFormFB = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });


    this.signUpFormFB = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
    });

  }

  /**
   * Loads users' data from local storage.
   * @throws {Error} If there's an error parsing the data.
   */
  async loadUsers() {
    try {
      this.ArraysService.users = JSON.parse(
        await this.RemotestorageService.getItem('users')
      );
    } catch (e) {
      console.error('Loading error:', e);
      throw new Error('Error loading users data');
    }
  }

  /**
   * Logs in the user as a guest. If a guest user is already logged in, it clears the guest user data and logs in the current user as a guest.
   * After logging in as a guest, it redirects the user to the "summary-component" page.
   */
  async guestLogIn() {
    if (
      this.ArraysService.guestUser &&
      this.ArraysService.guestUser.length > 0
    ) {
      // Get the current user data
      this.ArraysService.currentUser = JSON.parse(
        await this.RemotestorageService.getItem('user')
      );

      // Add the current user to the guestUser array
      this.ArraysService.guestUser.push(this.ArraysService.currentUser);
      // Clear the guestUser array
      this.ArraysService.guestUser = [];

      // Save the updated guestUser array to localStorage
      await this.RemotestorageService.setItem(
        'user',
        JSON.stringify(this.ArraysService.guestUser) || ''
      );
      // Redirect to the "summary-component" page
      this.currentUser = 'Guest'; // Set the current user's name
      await this.safeUser();
      this.router.navigate(['/summary']);
    } else {
      // If no guest user data is present, simply redirect to the "summary-component" page
      this.currentUser = 'Guest'; // Set the current user's name
      await this.safeUser();
      this.router.navigate(['/summary']);
    }
  }

  /**
   * This function search for User Data and than try with that data to login into JOIN
   */
  async logIn(data) {
    let user = this.ArraysService.users.find(
      (u) => u.email == data.email && u.password == data.password
    );
    if (user) {
      await this.RemotestorageService.setItem('user', JSON.stringify(user));
      this.currentUserEmail = user.email;
      await this.extractUserName();
      this.currentUser = user.name; // Set the current user's name
      await this.safeUser();
      this.router.navigate(['/summary']);
      data.email = '';
      data.password = '';
    } else {
      console.log('User not found');
      // TODO: Implementiere die Funktion failedLogIn(email, password);
    }
  }

  /**
   * This function search for User Data and than try with that data to login into JOIN
   */
  async logout() {
    // Clear the current user data in remote storage
    await this.RemotestorageService.setItem('current_user_array', JSON.stringify({}));
  
    // Reset the currentUser and currentUserEmail properties
    this.currentUser = null;
    this.currentUserEmail = null;
  
    // You can also add any other necessary logout logic here
  
    // Redirect to a login page or any other destination
    this.router.navigate(['']);
  }


  /**
   * Asynchronous function to save current user to remote storage
   */
  async safeUser() {
    let userData = {
      name: this.currentUser,
      // Add other user data here
    };
    await this.RemotestorageService.setItem('current_user_array', JSON.stringify(userData));
  }
  /**
   * Asynchronous function to load current user from remote storage
   */
  async loadUser() {
    let userData = JSON.parse(await this.RemotestorageService.getItem('current_user_array'));
    this.currentUser = userData.name;
  }

  /**
   * This function extracts the name of the current user from the "users" array
   */
  async extractUserName() {
    let email = this.currentUserEmail;
    let user = this.ArraysService.users.find(
      (contact) => contact.email === email
    );

    if (user) {
      this.currentUser = user.name;
      console.log(`Der aktuelle Benutzer ist: ${this.currentUser}`);
    } else {
      console.log('Benutzer nicht gefunden');
    }
  }

  /**
   * This function chooses a greeting slogan depending on the time of the day
   */
  getGreeting(): void {
    let currentTime = new Date().getHours();
    let greeting: string;

    if (currentTime >= 5 && currentTime < 12) {
      greeting = 'Good Morning';
    } else if (currentTime >= 12 && currentTime < 18) {
      greeting = 'Good Day';
    } else {
      greeting = 'Good Evening';
    }
    this.userGreeting = greeting;
  }
}
