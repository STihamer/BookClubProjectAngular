import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRentingDataComponent } from './add-renting-data.component';

describe('AddRentingDataComponent', () => {
  let component: AddRentingDataComponent;
  let fixture: ComponentFixture<AddRentingDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddRentingDataComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddRentingDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
