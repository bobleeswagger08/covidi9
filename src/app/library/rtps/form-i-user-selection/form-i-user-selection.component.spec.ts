import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormIUserSelectionComponent } from './form-i-user-selection.component';

describe('FormIUserSelectionComponent', () => {
  let component: FormIUserSelectionComponent;
  let fixture: ComponentFixture<FormIUserSelectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormIUserSelectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormIUserSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
