import { Component, OnInit } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';
import { UserInterface } from 'src/app/_models/user';

@Component({
  selector: 'app-disabled-view',
  templateUrl: './disabled-view.component.html',
  styleUrls: ['./disabled-view.component.css']
})
export class DisabledViewComponent implements OnInit {
  public emailString: string;
  public wtspString: string;
  public url: string;
  private currentUser: UserInterface;
  public isCompany: boolean;
  private urlwtsp: string;
  private mensaje: string;
  constructor(
    private deviceService: DeviceDetectorService,
  ) { }

  ngOnInit(): void {
    this.getInfo();
  }

  getInfo(): void {
    this.urlwtsp = "";
    this.mensaje = "";
    this.currentUser = this.getCurrentUser;

    if (this.currentUser) {
      this.getUrl();
      this.getUrlWtsp();
      this.emailString = `mailto:palominos90@gmail.com?Subject=Usuario ${this.currentUser.firstName} (rut:${this.currentUser.run}) desactivado`;
    } else {
      this.emailString = "mailto:palominos90@gmail.com?Subject=Usuario desactivado";
    }
  }

  getUrl() {
    this.isCompany = this.isOwner;
    if (this.currentUser.rol === 'worker') {
      this.url = "/harvest/harvests-view";
    } else {
      this.url = "/dashboard/show-data"
    }
  }

  getUrlWtsp() {
    if (this.isDesktop) {
      this.urlwtsp = "https://web.whatsapp.com/";
    } else if (this.isMobile || this.isTablet) {
      this.urlwtsp = "whatsapp://"
    }

    this.mensaje = `send?phone=56989189474&text=*Usuario ${this.currentUser.firstName} (rut: ${this.currentUser.run}) desactivado*%0A`;
    this.wtspString = this.urlwtsp + this.mensaje;
  }

  get isMobile(): boolean {
    return this.deviceService.isMobile();
  }

  get isTablet(): boolean {
    return this.deviceService.isTablet();
  }

  get isDesktop(): boolean {
    return this.deviceService.isDesktop();
  }

  get getCurrentUser(): UserInterface {
    if (localStorage.getItem('dataCurrentUser')) {
      return JSON.parse(localStorage.getItem('dataCurrentUser'))
    }
  }

  get isOwner(): boolean {
    if (this.currentUser.rol === 'company') {
      return true;
    }
    return false;
  }
}
