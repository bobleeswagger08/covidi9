import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartmentWiseAnalysisComponent } from './department-wise-analysis.component';

describe('DepartmentWiseAnalysisComponent', () => {
  let component: DepartmentWiseAnalysisComponent;
  let fixture: ComponentFixture<DepartmentWiseAnalysisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DepartmentWiseAnalysisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DepartmentWiseAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
