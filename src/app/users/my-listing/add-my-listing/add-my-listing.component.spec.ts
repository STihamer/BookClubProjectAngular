import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMyListingComponent } from './add-my-listing.component';

describe('AddMyListingComponent', () => {
  let component: AddMyListingComponent;
  let fixture: ComponentFixture<AddMyListingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddMyListingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddMyListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
