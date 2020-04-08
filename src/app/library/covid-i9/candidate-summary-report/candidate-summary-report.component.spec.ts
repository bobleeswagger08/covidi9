import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateSummaryReportComponent } from './candidate-summary-report.component';

describe('CandidateSummaryReportComponent', () => {
  let component: CandidateSummaryReportComponent;
  let fixture: ComponentFixture<CandidateSummaryReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CandidateSummaryReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidateSummaryReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
