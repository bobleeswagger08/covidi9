import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormIServiceReportComponent } from './form-i-service-report.component';

describe('FormIServiceReportComponent', () => {
  let component: FormIServiceReportComponent;
  let fixture: ComponentFixture<FormIServiceReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormIServiceReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormIServiceReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
