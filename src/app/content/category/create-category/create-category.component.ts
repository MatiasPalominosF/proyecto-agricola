import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Harvest } from 'src/app/_models/harvest';
import { UserInterface } from 'src/app/_models/user';
import { HarvestService } from 'src/app/_services/harvest/harvest.service';

@Component({
  selector: 'app-create-category',
  templateUrl: './create-category.component.html',
  styleUrls: ['./create-category.component.css']
})
export class CreateCategoryComponent implements OnInit {
  @Input() public uid: string;

  public title: string;
  public categoryForm: FormGroup;
  public submitted = false;
  private datePattern: string = '[0-9]{4}[-][0-9]{2}[-][0-9]{2}';
  @Output() passEntry: EventEmitter<any> = new EventEmitter();
  private currentUser: UserInterface;

  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private harvestService: HarvestService,
  ) { }

  ngOnInit(): void {
    this.title = 'Crear categoría';
    this.getUserLogged();

    this.categoryForm = this.formBuilder.group({
      id: [''],
      name: ['', Validators.required],
      dateStart: ['', Validators.required],
      dateEnd: [''],
      price: ['', Validators.required],
    });

  }

  get f() {
    return this.categoryForm.controls;
  }

  get fValue() {
    return this.categoryForm.value;
  }

  onProductSubmit() {
    this.submitted = true;

    if (this.categoryForm.invalid) {
      return;
    }

    let harvest: Harvest = {};
    let date: Date = new Date(this.fValue['dateStart'].year, (this.fValue['dateStart'].month - 1), this.fValue['dateStart'].day, 0, 0, 0, 0);
    this.fValue['dateStart'] = date;

    harvest = this.fValue;
    if (this.currentUser.rol === 'admin') {
      harvest.cuid = this.currentUser.cuid;
    } else if (this.currentUser.rol === 'company') {
      harvest.cuid = this.currentUser.uid;
    }
    this.harvestService.addNewProduct(harvest);
    this.passEntry.emit(true);
    this.activeModal.close(true);
  }

  getUserLogged(): void {
    if (localStorage.getItem('dataCurrentUser')) {
      this.currentUser = JSON.parse(localStorage.getItem('dataCurrentUser'));
    }
  }

}
