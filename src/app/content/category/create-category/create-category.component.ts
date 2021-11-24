import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-create-category',
  templateUrl: './create-category.component.html',
  styleUrls: ['./create-category.component.css']
})
export class CreateCategoryComponent implements OnInit {

  public title: string;
  public categoryForm: FormGroup;

  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.title = 'Crear categoría';

    this.categoryForm = this.formBuilder.group({
      name: ['', Validators.required],
      id: ['', Validators.required],
      dateEnd: ['', Validators.required],
      dateStart: ['', Validators.required],
    });

  }

}
