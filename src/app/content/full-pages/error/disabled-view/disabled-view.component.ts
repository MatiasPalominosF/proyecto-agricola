import { Component, OnInit } from '@angular/core';
import { UserInterface } from 'src/app/_models/user';

@Component({
  selector: 'app-disabled-view',
  templateUrl: './disabled-view.component.html',
  styleUrls: ['./disabled-view.component.css']
})
export class DisabledViewComponent implements OnInit {
  public emailString: string;
  public url: string;
  private currentUser: UserInterface;
  constructor() { }

  ngOnInit(): void {
    this.currentUser = this.getCurrentUser;
    console.log(this.currentUser);
    if (this.currentUser) {
      if (this.currentUser.rol === 'worker') {
        this.url = "/harvest/harvests-view";
      } else {
        this.url = "/dashboard/show-data"
      }
      this.emailString = `mailto:palominos90@gmail.com?Subject=Usuario ${this.currentUser.firstName} (rut:${this.currentUser.run}) desactivado`;
    } else {
      this.emailString = "mailto:palominos90@gmail.com?Subject=Usuario desactivado";
    }
  }

  get getCurrentUser(): UserInterface {
    if (localStorage.getItem('dataCurrentUser')) {
      return JSON.parse(localStorage.getItem('dataCurrentUser'))
    }
  }

  sendEmail(): void {

  }
}
