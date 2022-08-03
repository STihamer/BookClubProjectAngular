import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditWaitingListComponent } from './edit-waiting-list.component';

describe('EditWaitingListComponent', () => {
  let component: EditWaitingListComponent;
  let fixture: ComponentFixture<EditWaitingListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditWaitingListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditWaitingListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
