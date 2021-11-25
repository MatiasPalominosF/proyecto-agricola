import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HarvestService } from 'src/app/_services/harvest/harvest.service';

@Component({
  selector: 'app-create-category',
  templateUrl: './create-category.component.html',
  styleUrls: ['./create-category.component.css']
})
export class CreateCategoryComponent implements OnInit {

  public title: string;
  public categoryForm: FormGroup;
  public submitted = false;
  private datePattern: string = '[0-9]{4}[-][0-9]{2}[-][0-9]{2}';
  @Output() passEntry: EventEmitter<any> = new EventEmitter();

  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private harvestService: HarvestService,
  ) { }

  ngOnInit(): void {
    this.title = 'Crear categoría';

    this.categoryForm = this.formBuilder.group({
      name: ['', Validators.required],
      id: [''],
      dateEnd: [''],
      dateStart: ['', Validators.required],
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

    var formatDate = this.fValue['dateStart'].year + '-' + this.fValue['dateStart'].month + '-' + this.fValue['dateStart'].day + 'T00:00:00';
    let date: Date = new Date(formatDate);
    this.fValue['dateStart'] = date;

    this.harvestService.addNewProduct(this.fValue)
    this.passEntry.emit(true);
    this.activeModal.close(true);



  }

}
