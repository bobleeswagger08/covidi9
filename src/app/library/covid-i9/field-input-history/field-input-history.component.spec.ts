import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldInputHistoryComponent } from './field-input-history.component';

describe('CandidateInputHistoryComponent', () => {
  let component: FieldInputHistoryComponent;
  let fixture: ComponentFixture<FieldInputHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FieldInputHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FieldInputHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
