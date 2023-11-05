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
  @ViewChild('inputName') inputName: ElementRef;
  @ViewChild('inputEmail') inputEmail: ElementRef;
  @ViewChild('inputPassword') inputPassword: ElementRef;
  @ViewChild('confirmPasswordBox') confirmPasswordBox: ElementRef;
  @ViewChild('acceptPrivacy') acceptPrivacy: ElementRef;
  @ViewChild('successPopUp') successPopUp: ElementRef;

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









