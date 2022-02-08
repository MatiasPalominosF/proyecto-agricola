import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisabledViewComponent } from './disabled-view.component';

describe('DisabledViewComponent', () => {
  let component: DisabledViewComponent;
  let fixture: ComponentFixture<DisabledViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DisabledViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DisabledViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
