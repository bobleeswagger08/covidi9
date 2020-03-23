import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CourtCaseOrderListComponent } from './court-case-order-list.component';

describe('CourtCaseOrderListComponent', () => {
  let component: CourtCaseOrderListComponent;
  let fixture: ComponentFixture<CourtCaseOrderListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CourtCaseOrderListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CourtCaseOrderListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
