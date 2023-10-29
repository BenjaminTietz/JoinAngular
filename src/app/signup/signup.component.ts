// In signup.component.ts
import { Component, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { RemotestorageService } from '../remotestorage.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {


  @ViewChild('inputName') inputName: ElementRef;
  @ViewChild('inputEmail') inputEmail: ElementRef;
  @ViewChild('inputPassword') inputPassword: ElementRef;
  @ViewChild('confirmPasswordBox') confirmPasswordBox: ElementRef;
  @ViewChild('acceptPrivacy') acceptPrivacy: ElementRef;

  constructor(private router: Router, public RemotestorageService: RemotestorageService) { }

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

  async signUp() {
    debugger;
    // Retrieve user registration information from input fields
    let userName = this.inputName.nativeElement;
    let email = this.inputEmail.nativeElement;
    let password = this.inputPassword.nativeElement;
    let confirmPassword = this.confirmPasswordBox.nativeElement;


    // Validate if the password and confirm password match
    if (password === confirmPassword) {
        // Add the new user to the 'users' array
        this.users.push({
            'email': email.value,
            'password': password.value,
            'name': userName.value
        });
        console.log(this.users);
        // Save the updated 'users' array to local storage
        await this.RemotestorageService.setItem('users', JSON.stringify(this.users));

        // Reset the registration form
        //TODO implement Function to  : resetForm(userName, email, password);

        // Reload the 'users' array from local storage
        this.users = JSON.parse(await this.RemotestorageService.getItem('users'));

        // Redirect the user to the login page with a success message
        //TODO embedd Notification : You have successfully registered';
        console.log(this.users);
    } else {
        // Display an alert if the password and confirm password do not match
        alert("Password and confirm password don't match!");
        // Clear the input fields for password and confirm password
        password.value = '';
        confirmPassword.value = '';
        // Return from the function
        return;
    };
};




  redirectToLogin() {
    this.router.navigate(['/']);

  }
}
