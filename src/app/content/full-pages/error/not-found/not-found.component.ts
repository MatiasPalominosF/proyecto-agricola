import { Component, OnInit } from '@angular/core';
import { UserInterface } from 'src/app/_models/user';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.css']
})
export class NotFoundComponent implements OnInit {

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
