import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistersUsersComponent } from './registers-users.component';

describe('RegistersUsersComponent', () => {
  let component: RegistersUsersComponent;
  let fixture: ComponentFixture<RegistersUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistersUsersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistersUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
