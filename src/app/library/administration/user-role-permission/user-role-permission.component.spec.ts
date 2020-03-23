import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserRolePermissionComponent } from './user-role-permission.component';
import {MatTabsModule, MatTab, MatTabGroup} from '@angular/material/tabs';

describe('UserModuleTreeComponent', () => {
  let component: UserRolePermissionComponent;
  let fixture: ComponentFixture<UserRolePermissionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserRolePermissionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserRolePermissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
