import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  userGreeting;
  constructor() { }

  getGreeting(): void {
    let currentTime = new Date().getHours();
    let greeting: string;
  
    if (currentTime >= 5 && currentTime < 12) {
      greeting = "Good Morning";
    } else if (currentTime >= 12 && currentTime < 18) {
      greeting = "Good Day";
    } else {
      greeting = "Good Evening";
    }
    this.userGreeting = greeting;
  }
}
