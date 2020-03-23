import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserRoleAssignmentSelectionComponent } from './user-role-assignment-selection.component';

describe('UserRoleAssignmentSelectionComponent', () => {
  let component: UserRoleAssignmentSelectionComponent;
  let fixture: ComponentFixture<UserRoleAssignmentSelectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserRoleAssignmentSelectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserRoleAssignmentSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
