import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Observable } from 'rxjs';
import { UserInterface } from 'src/app/_models/user';
import { NotificationService } from 'src/app/_services/notification/notification.service';
import { UserService } from 'src/app/_services/user/user.service';
import { BreadcrumbInterface } from '../../../_models/breadcrumb';
import { ConfirmationService } from '../../../_services/confirmation/confirmation.service';

@Component({
  selector: 'app-user-view',
  templateUrl: './user-view.component.html',
  styleUrls: ['./user-view.component.css']
})
export class UserViewComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @BlockUI('cicles') blockUIUser: NgBlockUI;

  public displayedColumns: string[] = [];
  public dataSource: MatTableDataSource<UserInterface> = new MatTableDataSource<UserInterface>();
  public isEmpty: boolean = false;
  public breadcrumb: BreadcrumbInterface;
  private currentUser: UserInterface;
  public isLoading: boolean = false;
  public enabled: boolean;
  constructor(
    private userService: UserService,
    private confirmationDialogService: ConfirmationService,
    private notifyService: NotificationService,
  ) { }

  /** Comments initials to init mat table */
  sortingCustomAccesor = (item, property) => {
    switch (property) {
      case 'name': return item.name;
      case 'position': {
        console.log("property: ", property);
        console.log("item.position: ", item);
        return item.position
      };
      case 'dateinit': return item.dateinit;
      case 'dateend': return item.dateend;
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

      // Para compara numbers usar: data.position.toString().trim().indexOf(searchString.position) !== -1
      return data.firstName.toString().trim().toLowerCase().indexOf(searchString.name.toLowerCase()) !== -1 ||
        data.run.toString().trim().toLowerCase().indexOf(searchString.run.toLowerCase()) !== -1 ||
        data.rol.toString().trim().toLowerCase().indexOf(searchString.rol.toLowerCase()) !== -1;
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
          this.userService.updateUser(user).then(() => {
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
        }
        this.dataSource.data = users;
        this.blockUIUser.stop();
      });
    } else if (this.currentUser.rol === 'admin') {
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

  }

  editUser(user: UserInterface): void {
    console.log(user);
  }

  deleteUser(user: UserInterface): void {
    console.log(user);
  }

  setDisplayedColumns() {
    let rol: string = this.currentUser.rol;

    switch (rol) {
      case 'superadmin': {
        this.displayedColumns = ['position', 'run', 'name', 'rol', 'actions'];
        break;
      }
      case 'admin': {
        this.displayedColumns = ['position', 'run', 'name', 'rol', 'actions'];
        break;
      }
      case 'company': {
        this.displayedColumns = ['position', 'run', 'name', 'rol', 'actions'];
        break;
      }
      case 'worker': {
        this.displayedColumns = ['position', 'run', 'name', 'rol'];
        break;
      }
    }

  }

}
