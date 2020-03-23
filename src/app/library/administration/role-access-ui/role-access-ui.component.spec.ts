import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleAccessUiComponent } from './role-access-ui.component';

describe('RoleAccessUiComponent', () => {
  let component: RoleAccessUiComponent;
  let fixture: ComponentFixture<RoleAccessUiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoleAccessUiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoleAccessUiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
