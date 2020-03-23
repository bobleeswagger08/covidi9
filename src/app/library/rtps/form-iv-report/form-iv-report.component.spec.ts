import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormIvReportComponent } from './form-iv-report.component';

describe('FormIvReportComponent', () => {
  let component: FormIvReportComponent;
  let fixture: ComponentFixture<FormIvReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormIvReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormIvReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
