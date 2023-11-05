import { Component, Output, EventEmitter, ViewChild, ElementRef, OnInit, NgModule } from '@angular/core';
import { Router } from '@angular/router';
import { RemotestorageService } from '../remotestorage.service';
import { ArraysService } from '../contact-arrays.service';
import { LoginService } from '../login.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  @ViewChild('userEmail') userEmail: ElementRef;
  @ViewChild('userPassword') userPassword: ElementRef;

  form: FormGroup;
 
  constructor(
    private router: Router, 
    public RemotestorageService: RemotestorageService,
    public ArraysService: ArraysService,
    public LoginService: LoginService,
    private fb: FormBuilder,
    ) { 
      this.LoginService.logInForm.valueChanges.subscribe(console.log);
    }

  async ngOnInit() {
    this.LoginService.loadUsers();
    this.form = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, Validators.required],
    });
  }


  redirectToSignup() {
    this.router.navigate(['/signup']);
}

  redirectToSummary() {
    this.router.navigate(['/summary']);
}


}
