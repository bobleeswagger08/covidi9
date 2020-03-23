import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LawyerAssignmentComponent } from './lawyer-assignment.component';

describe('LawyerAssignmentComponent', () => {
  let component: LawyerAssignmentComponent;
  let fixture: ComponentFixture<LawyerAssignmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LawyerAssignmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LawyerAssignmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
