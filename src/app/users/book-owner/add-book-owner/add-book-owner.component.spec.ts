import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBookOwnerComponent } from './add-book-owner.component';

describe('AddBookOwnerComponent', () => {
  let component: AddBookOwnerComponent;
  let fixture: ComponentFixture<AddBookOwnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddBookOwnerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddBookOwnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
