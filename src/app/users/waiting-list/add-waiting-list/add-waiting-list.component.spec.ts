import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddWaitingListComponent } from './add-waiting-list.component';

describe('AddWaitingListComponent', () => {
  let component: AddWaitingListComponent;
  let fixture: ComponentFixture<AddWaitingListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddWaitingListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddWaitingListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
