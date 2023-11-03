import { Component, Output, EventEmitter, ViewChild, ElementRef, OnInit, NgModule } from '@angular/core';
import { Router } from '@angular/router';
import { RemotestorageService } from '../remotestorage.service';
import { ArraysService } from '../contact-arrays.service';
import { LoginService } from '../login.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  @ViewChild('userEmail') userEmail: ElementRef;
  @ViewChild('userPassword') userPassword: ElementRef;


  constructor(
    private router: Router, 
    public RemotestorageService: RemotestorageService,
    public ArraysService: ArraysService,
    public LoginService: LoginService
    ) { 
  }

  async ngOnInit() {
    this.LoginService.loadUsers();
  }


  redirectToSignup() {
    this.router.navigate(['/signup']);
}

  redirectToSummary() {
    this.router.navigate(['/summary']);
}


}
