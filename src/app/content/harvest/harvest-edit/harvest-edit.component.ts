import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HarvestService } from 'src/app/_services/harvest/harvest.service';

@Component({
  selector: 'app-harvest-edit',
  templateUrl: './harvest-edit.component.html',
  styleUrls: ['./harvest-edit.component.css']
})
export class HarvestEditComponent implements OnInit {

  @Input() public idCategory: string;
  @Input() public idUser: string;
  @Input() public weight: number;
  @Input() public id: string;
  @Input() public acumulate: number;
  @Output() passEntry: EventEmitter<any> = new EventEmitter();

  public registerInfo: FormGroup;
  public submitted = false;
  private restante = 0;
  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private harvestService: HarvestService,
  ) { }

  ngOnInit(): void {
    this.registerInfo = this.formBuilder.group({
      weight: ['', [Validators.required, Validators.min(1)]],
    });

    this.setDataInForm();
  }

  setDataInForm() {
    this.weight = this.round(this.weight, 2)
    this.f['weight'].setValue(this.weight);
  }

  get f() {
    return this.registerInfo.controls;
  }

  get fValue() {
    return this.registerInfo.value;
  }

  keyPress(event: any) {
    const pattern = /([0-9\+\-\+\.])/;

    const inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode !== 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.registerInfo.get(controlName).hasError(errorName);
  };

  round(value, exp) {
    if (typeof exp === 'undefined' || +exp === 0)
      return Math.round(value);

    value = +value;
    exp = +exp;

    if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0))
      return NaN;

    // Shift
    value = value.toString().split('e');
    value = Math.round(+(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp)));

    // Shift back
    value = value.toString().split('e');
    return +(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp));
  }

  updateReg(acumulate: number, weight: number): void {
    this.harvestService.updateFieldInRegisterUsers(this.idCategory, this.idUser, acumulate);
    this.harvestService.updateFieldInRegisters(this.idCategory, this.idUser, this.id, weight);
  }


  onFormSubmit() {
    this.submitted = true;


    if (this.registerInfo.invalid) {
      return;
    }

    var weightFlag = +this.f.weight.value;
    this.restante = this.weight - +this.f.weight.value;

    if (this.restante > 0) {
      weightFlag = 0;
      this.restante = this.restante * -1;
      this.acumulate += this.restante;
      this.updateReg(this.acumulate, +this.f.weight.value);
      this.passEntry.emit(true);
      this.activeModal.close(true);
    }
    else if (this.restante < 0) {
      weightFlag = 0;
      this.restante = this.restante * -1;
      this.acumulate += this.restante;
      this.updateReg(this.acumulate, +this.f.weight.value);
      this.passEntry.emit(true);
      this.activeModal.close(true);
    } else {
      this.activeModal.close(true);
    }
  }
}
