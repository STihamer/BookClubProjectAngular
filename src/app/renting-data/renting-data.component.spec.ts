import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RentingDataComponent } from './renting-data.component';

describe('RentingDataComponent', () => {
  let component: RentingDataComponent;
  let fixture: ComponentFixture<RentingDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RentingDataComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RentingDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
