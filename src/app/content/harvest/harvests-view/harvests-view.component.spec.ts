import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HarvestsViewComponent } from './harvests-view.component';

describe('HarvestsViewComponent', () => {
  let component: HarvestsViewComponent;
  let fixture: ComponentFixture<HarvestsViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HarvestsViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HarvestsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
