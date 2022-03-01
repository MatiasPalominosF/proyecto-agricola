import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NavigationExtras, Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { UserInterface } from 'src/app/_models/user';
import { NotificationService } from 'src/app/_services/notification/notification.service';
import { UserService } from 'src/app/_services/user/user.service';
import { BreadcrumbInterface } from '../../../_models/breadcrumb';
import { ConfirmationService } from '../../../_services/confirmation/confirmation.service';
import { UserModalComponent } from '../user-modal/user-modal.component';
import { CryptoService } from '../../../_services/cryptodata/crypto.service';
import { ContractInfo } from 'src/app/_models/contractInfo';

@Component({
  selector: 'app-user-view',
  templateUrl: './user-view.component.html',
  styleUrls: ['./user-view.component.css']
})
export class UserViewComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @BlockUI('cicles') blockUIUser: NgBlockUI;
  @BlockUI('contract') blockUIContract: NgBlockUI;

  public displayedColumns: string[] = [];
  public dataSource: MatTableDataSource<UserInterface> = new MatTableDataSource<UserInterface>();
  public isEmpty: boolean = false;
  public breadcrumb: BreadcrumbInterface;
  public currentUser: UserInterface;
  public isLoading: boolean = false;
  public enabled: boolean;
  private rol: string;
  private closeResult: string = '';

  constructor(
    private userService: UserService,
    private confirmationDialogService: ConfirmationService,
    private notifyService: NotificationService,
    private modalService: NgbModal,
    private router: Router,
    private crypto: CryptoService,
  ) { }

  /** Comments initials to init mat table */
  sortingCustomAccesor = (item: UserInterface, property) => {
    switch (property) {
      case 'run': return item.run;
      case 'name': return item.firstName;
      case 'rol': return item.rol;
      default: return item[property];
    }
  };

  /**
  * 
  * @returns Custom accessor function
  */
  filterCustomAccessor() {
    const myFilterPredicate = (data: UserInterface, filter: string): boolean => {
      let searchString = JSON.parse(filter);
      let rol: string = '';
      if (data.rol === 'worker') {
        rol = 'trabajador';
      } else if (data.rol === 'admin') {
        rol = 'administrador';
      } else if (data.rol === 'planner') {
        rol = 'planillero';
      } else {
        rol = 'Cosechador';
      }

      // Para compara numbers usar: data.position.toString().trim().indexOf(searchString.position) !== -1
      return data.firstName.toString().trim().toLowerCase().indexOf(searchString.name.toLowerCase()) !== -1 ||
        data.run.toString().trim().toLowerCase().indexOf(searchString.run.toLowerCase()) !== -1 ||
        rol.toString().trim().toLowerCase().indexOf(searchString.rol.toLowerCase()) !== -1;
    }
    return myFilterPredicate;
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.sortingDataAccessor = this.sortingCustomAccesor;

    /* configure filter */
    this.dataSource.filterPredicate = this.filterCustomAccessor();
  }
  /** End comments initials to init mat table */

  ngOnInit(): void {
    this.breadcrumb = {
      'mainlabel': 'Gestión de usuarios',
      'links': [
        {
          'name': 'Home',
          'isLink': true,
          'link': '/dashboard/show-data'
        },
        {
          'name': 'Usuarios',
          'isLink': false,
          'link': '#'
        },
      ],
      'options': false
    };
    this.getUserLogged();
    this.setDisplayedColumns();
    this.getUsers();

  }

  onChange(event: any, user: UserInterface) {
    this.isLoading = true;

    let str: string = '';

    if (event) {
      str = 'activar';
    } else {
      str = 'desactivar';
    }

    this.confirmationDialogService.confirm('Confirmación', '¿Estás seguro de ' + str + ' el usuario?')
      .then(confirmed => {
        if (!confirmed) {
          this.isLoading = false;
          this.getUsers();
        } else {
          user.isenabled = event;
          this.userService.updateUser(user).then().finally(() => {
            this.isLoading = false;
            this.notifyService.showSuccess(str.charAt(0).toUpperCase() + str.slice(1), "¡El usuario se editó correctamente!");
          });
        }
      }).catch((error) => {
        console.log("Not ok", error);
      });


  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    let filteredValues = {
      name: '',
      run: '',
      rol: ''
    };

    filteredValues['name'] = filterValue;
    filteredValues['run'] = filterValue;
    filteredValues['rol'] = filterValue;
    this.dataSource.filter = JSON.stringify(filteredValues);

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getUsers() {
    this.blockUIUser.start('Cargando...');
    this.isEmpty = true;

    if (this.currentUser.rol === 'superadmin') {
      this.userService.getUsersSuperAdmin().subscribe((users) => {
        if (users.length === 0) {
          this.isEmpty = true;
          this.blockUIUser.stop();
          this.isEmpty = false;
          return;
        };
        this.dataSource.data = users;
        this.blockUIUser.stop();
      });
    } else if (this.currentUser.rol === 'admin' || this.currentUser.rol === 'planner') {
      this.userService.getUsersAdmin(this.currentUser.cuid, this.currentUser.uid).subscribe(users => {
        if (users.length === 0) {
          this.isEmpty = true;
          this.blockUIUser.stop();
          this.isEmpty = false;
          return;
        }
        this.dataSource.data = users;
        this.blockUIUser.stop();
      });
    } else if (this.currentUser.rol === 'company') {
      this.userService.getUsersAdmin(this.currentUser.uid, this.currentUser.uid).subscribe(users => {
        if (users.length === 0) {
          this.isEmpty = true;
          this.blockUIUser.stop();
          this.isEmpty = false;
          return;
        }
        this.dataSource.data = users;
        this.blockUIUser.stop();
      });
    }
  }

  getUserLogged(): void {
    if (localStorage.getItem('dataCurrentUser')) {
      this.currentUser = JSON.parse(localStorage.getItem('dataCurrentUser'));
    }
  }

  addUser(): void {
    const modalRef = this.modalService.open(UserModalComponent, { windowClass: 'animated fadeInDown', backdrop: 'static' });
    modalRef.componentInstance.rol = this.rol;
    if (this.rol === 'company') {
      modalRef.componentInstance.uid = this.currentUser.uid;
    } else if (this.rol === 'admin') {
      modalRef.componentInstance.uid = this.currentUser.cuid;
    }
    modalRef.componentInstance.opc = true;
    modalRef.result.then((result) => {
      if (result) {
        this.notifyService.showSuccess("Agregar", "¡El usuario se añadió correctamente!");
      }
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  editUser(user: UserInterface): void {
    console.log(user);
  }

  showDetails(user: UserInterface): void {
    // Converts the route into a string that can be used 
    // with the window.open() function
    let infoUserContract: ContractInfo = {};
    this.blockUIContract.start("Cargando...");
    this.userService.getOneUser(user.cuid).subscribe(boss => {
      infoUserContract.addressWorker = user.address;
      infoUserContract.addressCompany = boss.addressCompany;
      infoUserContract.cityWorker = user.city;
      infoUserContract.cityCompany = boss.cityCompany;
      infoUserContract.emailWorker = user.email;
      infoUserContract.emailCompany = boss.email;
      infoUserContract.firstNameWorker = user.firstName;
      infoUserContract.firstNameOwnerCompany = boss.firstName;
      infoUserContract.lastNameWorker = user.lastName;
      infoUserContract.lastNameOwnerCompany = boss.lastName;
      infoUserContract.nameCompany = boss.nameCompany;
      infoUserContract.rolWorker = user.rol;
      infoUserContract.runWorker = user.run;
      infoUserContract.runCompany = boss.runCompany;
      infoUserContract.runOwnerCompany = boss.run;
      infoUserContract.stateWorker = user.state;
      infoUserContract.stateCompany = boss.stateCompany;
      infoUserContract.admissionDate = user.admissionDate;
      infoUserContract.addressOwnerCompany = boss.address;
      infoUserContract.cityOwnerCompany = boss.city;
      infoUserContract.stateOwnerCompany = boss.state;

      let userInfoEncrypt = this.crypto.encryptData(infoUserContract);
      this.crypto.setInfoStorage(userInfoEncrypt);
      const url = this.router.serializeUrl(this.router.createUrlTree(['/contract/export-contract']));
      this.blockUIContract.stop();
      window.open(url, '_blank');
    });
  }

  setDisplayedColumns() {
    let rol: string = this.currentUser.rol;

    switch (rol) {
      case 'superadmin': {
        this.rol = 'superadmin';
        this.displayedColumns = ['position', 'run', 'name', 'rol', 'actions'];
        break;
      }
      case 'admin': {
        this.rol = 'admin';
        this.displayedColumns = ['position', 'run', 'name', 'rol', 'actions'];
        break;
      }
      case 'company': {
        this.rol = 'company';
        this.displayedColumns = ['position', 'run', 'name', 'rol', 'actions'];
        break;
      }
      case 'worker': {
        this.rol = 'worker';
        this.displayedColumns = ['position', 'run', 'name', 'rol'];
        break;
      }
    }

  }

}
