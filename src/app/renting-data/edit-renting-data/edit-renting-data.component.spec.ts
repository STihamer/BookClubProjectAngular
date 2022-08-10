import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditRentingDataComponent } from './edit-renting-data.component';

describe('EditRentingDataComponent', () => {
  let component: EditRentingDataComponent;
  let fixture: ComponentFixture<EditRentingDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditRentingDataComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditRentingDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
