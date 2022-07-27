import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookOwnersComponent } from './book-owners.component';

describe('BookOwnersComponent', () => {
  let component: BookOwnersComponent;
  let fixture: ComponentFixture<BookOwnersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookOwnersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookOwnersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
