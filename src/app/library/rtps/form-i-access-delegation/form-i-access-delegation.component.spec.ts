import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormIAccessDelegationComponent } from './form-i-access-delegation.component';

describe('FormIAccessDelegationComponent', () => {
  let component: FormIAccessDelegationComponent;
  let fixture: ComponentFixture<FormIAccessDelegationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormIAccessDelegationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormIAccessDelegationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
