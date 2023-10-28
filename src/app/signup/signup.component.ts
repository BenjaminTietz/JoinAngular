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

  constructor(private router: Router, private RemotestorageService: RemotestorageService) { }

  async signUp() {
    // Retrieve user registration information from input fields
    let userName = this.inputName.nativeElement;
    let email = this.inputEmail.nativeElement;
    let password = this.inputPassword.nativeElement;
    let confirmPassword = this.confirmPasswordBox.nativeElement;


    // Validate if the password and confirm password match
    if (password === confirmPassword) {
        // Add the new user to the 'users' array
        this.RemotestorageService.users.push({
            email: email.value,
            password: password,
            name: userName.value
        });

        // Save the updated 'users' array to local storage
        await this.RemotestorageService.setItem('users', JSON.stringify(this.RemotestorageService.users));

        // Reset the registration form
        //resetForm(userName, email, password);

        // Reload the 'users' array from local storage
        this.RemotestorageService.users = JSON.parse(await this.RemotestorageService.getItem('users'));

        // Redirect the user to the login page with a success message
        //window.location.href = 'login.html?msg=You have successfully registered';
        console.log(this.RemotestorageService.users);
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
