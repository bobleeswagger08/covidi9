import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CourtCaseOrderComponent } from './court-case-order.component';

describe('CourtCaseOrderComponent', () => {
  let component: CourtCaseOrderComponent;
  let fixture: ComponentFixture<CourtCaseOrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CourtCaseOrderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CourtCaseOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
