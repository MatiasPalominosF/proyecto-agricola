import { Component, OnInit } from '@angular/core';
import { UserInterface } from 'src/app/_models/user';

@Component({
  selector: 'app-not-allowed',
  templateUrl: './not-allowed.component.html',
  styleUrls: ['./not-allowed.component.css']
})
export class NotAllowedComponent implements OnInit {

  public currentUser: UserInterface;

  constructor() { }

  ngOnInit(): void {
    this.getUserLogged();
  }

  getUserLogged(): void {
    if (localStorage.getItem('dataCurrentUser')) {
      this.currentUser = JSON.parse(localStorage.getItem('dataCurrentUser'));
    }
  }

}
