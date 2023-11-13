// In signup.component.ts
import { Component, Output, EventEmitter, ViewChild, ElementRef, NgModule } from '@angular/core';
import { Router } from '@angular/router';
import { RemotestorageService } from '../remotestorage.service';
import { ArraysService } from '../contact-arrays.service';
import { LoginService } from '../login.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
/**
 * Reference to the 'inputName' element.
 */
@ViewChild('inputName') inputName: ElementRef;

/**
 * Reference to the 'inputEmail' element.
 */
@ViewChild('inputEmail') inputEmail: ElementRef;

/**
 * Reference to the 'inputPassword' element.
 */
@ViewChild('inputPassword') inputPassword: ElementRef;

/**
 * Reference to the 'confirmPasswordBox' element.
 */
@ViewChild('confirmPasswordBox') confirmPasswordBox: ElementRef;

/**
 * Reference to the 'acceptPrivacy' element.
 */
@ViewChild('acceptPrivacy') acceptPrivacy: ElementRef;

/**
 * Reference to the 'successPopUp' element.
 */
@ViewChild('successPopUp') successPopUp: ElementRef;

/**
 * Reference to the 'privacyWrapper' element.
 */
@ViewChild('privacyWrapper') privacyWrapper: ElementRef;

/**
 * Reference to the 'signUpWrapper' element.
 */
@ViewChild('signUpWrapper') signUpWrapper: ElementRef;

/**
 * Reference to the 'legalNoticeWrapper' element.
 */
@ViewChild('legalNoticeWrapper') legalNoticeWrapper: ElementRef;

  form: FormGroup;

  constructor(
    private router: Router, 
    public RemotestorageService: RemotestorageService,
    public ArraysService: ArraysService,
    public LoginService: LoginService,
    private fb: FormBuilder,
    ) { 
      this.LoginService.signUpForm.valueChanges.subscribe(console.log);
    }


/**
 * Registers a new user with the provided data.
 *
 * @param {object} data - An object containing user registration data, including email, password, and name.
 */
async signUp(data) {
  console.log(data);

  // Validate if the password and confirm password match
  if (data.password === data.confirmPassword) {
      // Add the new user to the 'users' array
      this.ArraysService.users.push({
          'email': data.email,
          'password': data.password,
          'name': data.name
      });

      console.log(this.ArraysService.users);

      // Save the updated 'users' array to remote storage
      await this.RemotestorageService.setItem('users', JSON.stringify(this.ArraysService.users));

      // Reset the registration form
      this.resetForm(data);

      // Reload the 'users' array from remote storage
      this.ArraysService.users = JSON.parse(await this.RemotestorageService.getItem('users'));

      // Redirect the user to the login page with a success message
      this.showSuccessMessage();
      setTimeout(() => {
          this.router.navigate(['/']);
      }, 2000);

      console.log(this.ArraysService.users);
  } else {
      // Display an alert if the password and confirm password do not match
      alert("Password and confirm password don't match!");

      // Clear the input fields for password and confirm password
      data.password = '';
      data.confirmPassword = '';

      // Return from the function
      return;
  }
}

/**
 * Displays a success message popup.
 */
showSuccessMessage() {
  this.successPopUp.nativeElement.classList.toggle('show-popup');
}

/**
* Resets the form by clearing the provided data object's properties.
*
* @param {object} data - The data object to reset, including name, password, and confirmPassword.
*/
resetForm(data) {
  data.name = '';
  data.password = '';
  data.confirmPassword = '';
}

/**
* Redirects the user to the login page.
*/
redirectToLogin() {
  this.router.navigate(['/']);
}

/**
* Displays the privacy policy section while hiding the sign-up section.
*/
showPrivacyPolicy() {
  this.privacyWrapper.nativeElement.classList.add('show');
  this.signUpWrapper.nativeElement.classList.add('hide');
}

/**
* Hides the privacy policy section while showing the sign-up section.
*/
hidePrivacyPolicy() {
  this.privacyWrapper.nativeElement.classList.remove('show');
  this.signUpWrapper.nativeElement.classList.remove('hide');
}

/**
* Displays the legal notice section while hiding the sign-up section.
*/
showLegalNotice() {
  this.legalNoticeWrapper.nativeElement.classList.add('show');
  this.signUpWrapper.nativeElement.classList.add('hide');
}

/**
* Hides the legal notice section while showing the sign-up section.
*/
hideLegalNotice() {
  this.legalNoticeWrapper.nativeElement.classList.remove('show');
  this.signUpWrapper.nativeElement.classList.remove('hide');
}

}









