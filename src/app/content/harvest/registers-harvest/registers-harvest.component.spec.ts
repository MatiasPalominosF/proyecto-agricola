import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistersHarvestComponent } from './registers-harvest.component';

describe('RegistersHarvestComponent', () => {
  let component: RegistersHarvestComponent;
  let fixture: ComponentFixture<RegistersHarvestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistersHarvestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistersHarvestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
