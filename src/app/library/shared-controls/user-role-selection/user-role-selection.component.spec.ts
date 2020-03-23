import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserRoleSelectionComponent } from './user-role-selection.component';

describe('UserRoleSelectionComponent', () => {
  let component: UserRoleSelectionComponent;
  let fixture: ComponentFixture<UserRoleSelectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserRoleSelectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserRoleSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
