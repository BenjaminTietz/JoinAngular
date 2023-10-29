// In signup.component.ts
import { Component, Output, EventEmitter, ViewChild, ElementRef, NgModule } from '@angular/core';
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
  @ViewChild('successPopUp') successPopUp: ElementRef;
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

  async signUp(data) {
    //alert('SUCCESS!! :-)\n\n' + JSON.stringify(data, null, 4));
        // Validate if the password and confirm password match
        if (data.password === data.confirmPassword) {
            // Add the new user to the 'users' array
            this.users.push({
                'email': data.email,
                'password': data.password,
                'name': data.name
            });
            console.log(this.users);
            // Save the updated 'users' array to local storage
            await this.RemotestorageService.setItem('users', JSON.stringify(this.users));
    
            // Reset the registration form
            this.resetForm(data);
    
            // Reload the 'users' array from local storage
            this.users = JSON.parse(await this.RemotestorageService.getItem('users'));
    
            // Redirect the user to the login page with a success message
            this.showSuccessMessage();
            setTimeout(() => {
              this.router.navigate(['/']);
            }, 2000);
            console.log(this.users);
        } else {
            // Display an alert if the password and confirm password do not match
            alert("Password and confirm password don't match!");
            // Clear the input fields for password and confirm password
            data.password = '';
            data.confirmPassword = '';
            // Return from the function
            return;
        };
    };

    showSuccessMessage() {
      this.successPopUp.nativeElement.classList.toggle('show-popup');
    }
    resetForm(data) {
      data.name = '';
      data.password = '';
      data.confirmPassword = '';
    }

    redirectToLogin() {
      this.router.navigate(['/']);
  
    }
}









